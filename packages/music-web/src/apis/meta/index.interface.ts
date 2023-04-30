export interface IObject {
  songId?: string;
  songName?: string;
  artistId?: string;
  artistName?: string;
  albumId?: string;
  albumName?: string;
}

export interface ISearchObjectParams {
  objects?: IObject[];
  offset: number;
  limit: number;
}

export enum MusicObjectStatusEnum {
  IN_USE = 0,
  OFFLINE = 1
}

export interface IMusicObject {
  id: string;
  songId: string;
  songName: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  imgUrl: string;
  playUrl: string;
  status: MusicObjectStatusEnum;
}

export interface IMusicSearchResp {
  list: IMusicObject[];
  total: number;
}

export interface IMusicOfflineParams {
  id: string;
}

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
