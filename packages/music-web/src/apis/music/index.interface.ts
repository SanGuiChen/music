export enum FavoriteSourceEnum {
  OP = 'OP',
  NETEASE = 'NETEASE'
}

export interface IComment {
  content: string;
  user: {
    avatarUrl: string;
    nickname: string;
    userId: number;
  };
  ipLocation: {
    location: string;
  };
  time: number;
  timeStr: string;
  commentId: number;
  likedCount: number;
}

export interface IThumbUp {
  id: string;
  songId: string;
  userId: string;
  commentId: string;
  createTime: string;
  updateTime: string;
  extra?: string;
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

export interface ISearchThumbUpResp {
  thumbUps: IThumbUp[];
  total: number;
}

export interface ICreateThumbUpParams {
  commentId: number;
  userId: string;
  songId: string;
}

export interface IDeleteThumbUpParams {
  id?: string;
  userId?: string;
  commentId?: number;
}
