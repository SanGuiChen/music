export interface ISearchParams {
  keyWords: string[];
  offset: number;
  limit: number;
}

interface IArtist {
  artistId: string;
  artistName: string;
}

export interface ISearchResponse {
  list: ISearchList[];
  total: number;
}

interface ISearchList {
  songId: number;
  songName: string;
  artists: IArtist[];
  albumId: number;
  albumName: string;
  imgUrl: string;
  playUrl: string;
}

export interface IPlayUrlParams {
  songIds: number[];
}

export type IPlayUrlResponse = Record<string, string>;

export interface IStorageParams {
  songId: number;
  songName: string;
  artistId: string;
  artistName: string;
  albumId: number;
  albumName: string;
  imgUrl: string;
  playUrl: string;
}
