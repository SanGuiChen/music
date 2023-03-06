import axiosInstance, { IResponse } from '..';
import {
  IPlayUrlParams,
  IPlayUrlResponse,
  ISearchParams,
  ISearchResponse,
  IStorageParams
} from './index.interface';

export const searchApi = async (
  params: ISearchParams
): Promise<IResponse<ISearchResponse>> => {
  return axiosInstance.post('script/search', params).then((res) => res.data);
};

export const getPlayUrlApi = async (
  params: IPlayUrlParams
): Promise<IResponse<IPlayUrlResponse>> => {
  return axiosInstance.post('script/play/url', params).then((res) => res.data);
};

export const storageApi = async (
  params: IStorageParams
): Promise<IResponse<any>> => {
  return axiosInstance.post('script/storage', params).then((res) => res.data);
};
