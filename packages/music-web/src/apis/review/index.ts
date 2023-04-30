import axiosInstance, { IResponse } from '..';
import {
  ICreateReviewParams,
  IReview,
  ISearchReviewParams,
  ISearchReviewResp,
  ISubmitReviewParams
} from './index.interface';

export const searchReviewApi = async (
  params: ISearchReviewParams
): Promise<IResponse<ISearchReviewResp>> => {
  return axiosInstance.post('review/search', params).then((res) => res.data);
};

export const createReviewApi = async (
  params: ICreateReviewParams
): Promise<IResponse<IReview[]>> => {
  return axiosInstance.post('review/create', params).then((res) => res.data);
};

export const submitReviewApi = async (
  params: ISubmitReviewParams
): Promise<IResponse<any>> => {
  return axiosInstance.post('review/submit', params).then((res) => res.data);
};

export const rejectReviewApi = async (
  params: ISubmitReviewParams
): Promise<IResponse<any>> => {
  return axiosInstance.post('review/reject', params).then((res) => res.data);
};
