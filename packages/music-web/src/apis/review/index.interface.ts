export enum ReviewStatusEnum {
  NOT_START = 0,
  NOT_PASS = 1,
  PASS = 2
}

export interface IReview {
  id: string;
  reviewerId: string;
  employeeId: string;
  taskId: string;
  status: ReviewStatusEnum;
  lyric?: string;
  playUrl?: string;
  createTime: string;
  updateTime: string;
  extra?: string;
}

export interface ISearchReviewParams {
  id?: string;
  reviewerId?: string;
  employeeId?: string;
  taskId?: string;
  status?: ReviewStatusEnum;
  createTime?: string;
  offset: number;
  limit: number;
}

export interface ISearchReviewResp {
  total: number;
  reviews: IReview[];
}

export interface ICreateReviewParams {
  reviewerId: string;
  employeeId: string;
  taskId: string;
  extra?: string;
  lyric: string;
  playUrl?: string;
}

export interface ISubmitReviewParams {
  id: string;
}
