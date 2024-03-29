import { RoleEnum, UserStatusEnum } from './../../store/user';
export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  nickName: string;
  avatar?: string;
  email: string;
  passWord: string;
}

export interface IUpdate {
  id: string;
  nickName?: string;
  avatar?: string;
  email?: string;
  passWord?: string;
  role?: RoleEnum;
}

export interface ISearchUserParams {
  id?: string;
  nickname?: string;
  email?: string;
  role?: RoleEnum;
  status?: UserStatusEnum;
}
