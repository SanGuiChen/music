import i18next from 'i18next';
import { create } from 'zustand';

export enum UserStatusEnum {
  BANNED = 0,
  IN_USE = 1
}

export enum RoleEnum {
  SUPER_ADMIN = 1,
  USER = 2,
  GUEST = 3
}

export const RoleEnumTextMap = (type: RoleEnum) => {
  switch (type) {
    case RoleEnum.GUEST:
      return i18next.t('GUEST');
    case RoleEnum.SUPER_ADMIN:
      return i18next.t('ADMIN');
    case RoleEnum.USER:
      return i18next.t('USER');
    default:
      return i18next.t('USER');
  }
};

export interface User {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  role: RoleEnum;
  status: UserStatusEnum;
}

interface IUserStore {
  user: User;
  setUser: (user: User) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: {} as User,
  setUser: (user: User) => set(() => ({ user }))
}));
