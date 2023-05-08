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

/**
 * 将时间戳转换为UTC+8时间下的年月日时分秒
 * @param {number} timestamp - 时间戳，单位为秒
 * @param {string} [separator='-'] - 年月日分隔符，默认为'-'
 * @returns {string} - 返回格式为'YYYY年MM月DD日 HH:mm:ss'的字符串
 */
export function convertTimestampToUTC8(timestamp: number) {
  // 创建一个Date对象，使用UTC时间
  const utcDate = new Date(timestamp * 1000);

  // 将UTC时间转换为UTC+8时间
  const utc8TimeStamp = utcDate.getTime() + 8 * 60 * 60 * 1000;

  // 创建一个新的Date对象，使用UTC+8时间
  const utc8Date = new Date(utc8TimeStamp);

  // 将UTC+8时间格式化为字符串
  const year = utc8Date.getFullYear();
  const month = (utc8Date.getMonth() + 1).toString().padStart(2, '0');
  const day = utc8Date.getDate().toString().padStart(2, '0');
  const hour = utc8Date.getHours().toString().padStart(2, '0');
  const minute = utc8Date.getMinutes().toString().padStart(2, '0');
  const second = utc8Date.getSeconds().toString().padStart(2, '0');
  const utc8Str = `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;

  return utc8Str; // 输出格式为：'YYYY年MM月DD日 HH:mm:ss'
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
