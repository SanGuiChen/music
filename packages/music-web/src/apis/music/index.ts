import { message } from 'antd';
import axiosInstance, { CustomAxiosRequestConfig, IResponse } from '..';
import {
  ICreateFavoriteParams,
  IDeleteFavoriteParams,
  IFavorite,
  ISearchFavoriteResp
} from './index.interface';

export const searchFavoriteApi = async (
  userId: string
): Promise<IResponse<ISearchFavoriteResp>> => {
  return axiosInstance
    .post('music/search/favorite', { userId })
    .then((res) => res.data);
};

export const createFavoriteApi = async (
  params: ICreateFavoriteParams
): Promise<IResponse<IFavorite>> => {
  return axiosInstance
    .post('music/create/favorite', params)
    .then((res) => res.data);
};

export const deleteFavoriteApi = async (
  params: IDeleteFavoriteParams
): Promise<IResponse<IFavorite>> => {
  if (!params?.id && (!params?.songId || !params?.userId)) {
    message.error('参数中必须有id 或 songId、userId两者');
    throw Error('参数中必须有id 或 songId、userId两者');
  }
  return axiosInstance
    .post('music/delete/favorite', params)
    .then((res) => res.data);
};

export const getBanner = async (): Promise<{
  banners: any[];
  code: number;
}> => {
  return axiosInstance
    .get('banner', {
      params: { type: 0 },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getPersonalizedNewMusic = async (
  limit: number
): Promise<{
  result: any[];
  code: number;
  hasTaste: boolean;
  category: number;
}> => {
  return axiosInstance
    .get('personalized/newsong', {
      params: { limit },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getSongUrlById = async (
  id: number[] // 接口返回的是number
): Promise<{
  data: any[];
  code: number;
}> => {
  return axiosInstance
    .get('song/url/v1', {
      params: { id: id.join(','), level: 'lossless' },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export enum SONG_TYPE {
  ALL = 0,
  CHINESE = 7,
  EU_USA = 96,
  JAPANESE = 8,
  KOREAN = 16
}

export const getTopSongs = async (
  type = SONG_TYPE.ALL
): Promise<{
  data: any[];
  code: number;
}> => {
  return axiosInstance
    .get('/top/song', {
      params: { type },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getSongDetails = async (
  ids: number[]
): Promise<{
  songs: any[];
  privileges: any[];
  code: number;
}> => {
  return axiosInstance
    .get('/song/detail', {
      params: { ids: ids.join(',') },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getSongLyric = async (
  id: number
): Promise<{
  lrc: {
    version: number;
    lyric: string;
  };
  code: number;
}> => {
  return axiosInstance
    .get('/lyric', {
      params: { id },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getSearchSuggest = async (
  keywords: string
): Promise<{
  result: {
    albums: { name: string }[];
    artists: { name: string }[];
    playlists: { name: string }[];
    songs: { name: string }[];
  };
  code: number;
}> => {
  return axiosInstance
    .get('/search/suggest', {
      params: { keywords },
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const getSearchHot = async (): Promise<{
  result: {
    hots: { first: string }[];
  };
  code: number;
}> => {
  return axiosInstance
    .get('/search/hot', {
      directScript: true
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};

export const searchByKeyWords = async (
  keywords: string
): Promise<{
  result: {
    songCount: number;
    songs: any[];
  };
  code: number;
}> => {
  return axiosInstance
    .get('/cloudsearch', {
      directScript: true,
      params: { keywords }
    } as CustomAxiosRequestConfig)
    .then((res) => res.data);
};
