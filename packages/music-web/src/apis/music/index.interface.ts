export enum FavoriteSourceEnum {
  OP = 'OP',
  NETEASE = 'NETEASE'
}

export interface IFavorite {
  id: string;
  songId: string;
  userId: string;
  source: FavoriteSourceEnum;
  createTime: string;
  updateTime: string;
  extra?: string;
}

export interface ISearchFavoriteResp {
  songs: IFavorite[];
  total: number;
}

export interface ICreateFavoriteParams {
  songId: string;
  userId: string;
  source: FavoriteSourceEnum;
}

export interface IDeleteFavoriteParams {
  id?: string;
  userId?: string;
  songId?: string;
}
