import { MUSIC_TOKEN } from '@/constants';
import { isString } from 'lodash';

export function* uniqueIdGenerator(prefix: string): Generator<string> {
  let count = 0;
  while (true) {
    yield `${prefix}_${new Date().valueOf()}_${count++}`;
  }
}

export const isLogin = () => {
  const token = window.localStorage.getItem(MUSIC_TOKEN);
  return isString(token);
};
