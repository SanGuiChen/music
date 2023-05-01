import axiosInstance, { IResponse } from '..';
import {
  IClaimTaskParams,
  ICreateTaskParams,
  ISearchPersonalTaskParams,
  ISearchPersonalTaskResp,
  ISearchTaskParams,
  ITask
} from './index.interface';

export const searchTaskApi = async (
  params: ISearchTaskParams
): Promise<IResponse<ITask[]>> => {
  return axiosInstance.post('task/search/task', params).then((res) => res.data);
};

export const searchPersonalTaskApi = async (
  params: ISearchPersonalTaskParams
): Promise<IResponse<ISearchPersonalTaskResp>> => {
  return axiosInstance
    .post('task/search/personal', params)
    .then((res) => res.data);
};

export const createTaskApi = async (
  params: ICreateTaskParams
): Promise<IResponse<ITask>> => {
  return axiosInstance.post('task/create', params).then((res) => res.data);
};

export const deleteTaskApi = async (id: string): Promise<IResponse<ITask>> => {
  return axiosInstance.post('task/delete', { id }).then((res) => res.data);
};

export const claimTaskApi = async (
  params: IClaimTaskParams
): Promise<IResponse<any>> => {
  return axiosInstance.post('task/claim', params).then((res) => res.data);
};
