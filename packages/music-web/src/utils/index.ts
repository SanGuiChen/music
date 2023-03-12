import { getUserInfoApi } from '@/apis/user/user';
import { MUSIC_TOKEN } from '@/constants';
import { User } from '@/store/user';
import { isString, isEmpty } from 'lodash';

export function* uniqueIdGenerator(prefix: string): Generator<string> {
  let count = 0;
  while (true) {
    yield `${prefix}_${new Date().valueOf()}_${count++}`;
  }
}

export const isLogin = async () => {
  const token = window.localStorage.getItem(MUSIC_TOKEN);

  if (isString(token)) {
    const { data } = await getUserInfoApi();
    if (data && !isEmpty(data)) {
      return data;
    }
  }
  return {} as User;
};
