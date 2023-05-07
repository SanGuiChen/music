import { getUserInfoApi } from '@/apis/user/user';
import { MUSIC_TOKEN } from '@/constants';
import { IUser } from '@/store/user';
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
  return {} as IUser;
};

// formatDate(dateString, "yyyy-MM-dd HH:mm:ss");
export function formatDate(dateString: string, format: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 注意月份从0开始，所以需要加1
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  // 定义格式化规则
  const rules: { [key: string]: any } = {
    yyyy: year,
    MM: month < 10 ? '0' + month : month,
    dd: day < 10 ? '0' + day : day,
    HH: hour < 10 ? '0' + hour : hour,
    mm: minute < 10 ? '0' + minute : minute,
    ss: second < 10 ? '0' + second : second
  };

  // 替换格式化规则
  const result = format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, (match) => {
    return rules[match];
  });

  return result;
}

export const formatNum = (num: number | string, n = 2) => {
  let len = num.toString().length;

  while (len < n) {
    num = '0' + num;
    len++;
  }

  return num;
};

export const formatTime = (interval?: number) => {
  interval = Math.floor(interval || 0);
  const minute = formatNum(Math.floor(interval / 60));
  const second = formatNum(interval % 60);
  return `${minute}:${second}`;
};
