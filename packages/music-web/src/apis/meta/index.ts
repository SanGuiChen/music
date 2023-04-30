import axiosInstance, { IResponse } from '..';
import {
  IMusicObject,
  IMusicOfflineParams,
  IMusicSearchResp,
  ISearchObjectParams,
  IStorageParams
} from './index.interface';

export const searchMusicObjectApi = async (
  params: ISearchObjectParams
): Promise<IResponse<IMusicSearchResp>> => {
  return axiosInstance.post('manage/search', params).then((res) => res.data);
};

export const offlineMusicObjectApi = async (
  params: IMusicOfflineParams
): Promise<IResponse<IMusicObject>> => {
  return axiosInstance.post('manage/offline', params).then((res) => res.data);
};

export const shelvesMusicObjectApi = async (
  params: IMusicOfflineParams
): Promise<IResponse<IMusicObject>> => {
  return axiosInstance.post('manage/shelves', params).then((res) => res.data);
};

export const storageApi = async (
  params: IStorageParams
): Promise<IResponse<any>> => {
  return axiosInstance.post('manage/storage', params).then((res) => res.data);
};
