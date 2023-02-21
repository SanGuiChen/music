import { MUSIC_TOKEN } from '@/constants';
import { message } from 'antd';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showMessage } from './status';

export interface IResponse {
  code: number | string;
  data: any;
  msg: string;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 5000,
  headers: {}
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem(MUSIC_TOKEN);
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
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
