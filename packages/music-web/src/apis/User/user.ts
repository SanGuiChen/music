import axiosInstance, { IResponse } from '..';
import { ILogin, IRegister } from './index.interface';

export const loginApi = async (params: ILogin): Promise<IResponse<any>> => {
  return axiosInstance.post('auth/login', params).then((res) => res.data);
};

export const registerApi = async (
  params: IRegister
): Promise<IResponse<any>> => {
  return axiosInstance.post('auth/register', params).then((res) => res.data);
};

export const verifyTokenApi = async (params: any): Promise<IResponse<any>> => {
  return {} as any;
};
