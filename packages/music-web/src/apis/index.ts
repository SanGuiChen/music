import { MUSIC_API_URL, MUSIC_TOKEN, SCRIPT_API_URL } from '@/constants';
import { message } from 'antd';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showMessage } from './status';

export interface IResponse<T> {
  code: number | string;
  data: T;
  msg: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  directScript?: boolean;
}

interface Instance extends AxiosInstance {
  (config: CustomAxiosRequestConfig): Promise<any>;
}

const axiosInstance = axios.create({
  baseURL: MUSIC_API_URL,
  timeout: 5000,
  headers: {}
}) as Instance;

axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    if (config?.directScript) {
      // 需要直接请求script api
      config.baseURL = SCRIPT_API_URL;
      delete config.directScript;
      return config;
    }
    const token = localStorage.getItem(MUSIC_TOKEN);
    if (token && config?.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config as any;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res.data.code === 200) {
      return res;
    } else {
      showMessage(res.status);
      return res;
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      message.error(
        response?.data?.message
          ? response?.data?.message
          : showMessage(response.status)
      );
      return Promise.reject(response.data);
    } else {
      message.error('网络连接异常,请稍后再试!');
    }
  }
);

export default axiosInstance;
