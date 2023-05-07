import { FC } from 'react';

interface IMetaProps {
  navigation?: string;
  requireAuth?: boolean;
  onlyAdmin?: boolean;
}

interface IRedirectProps {
  fromPath: string;
  toPath: string;
}

export interface IRoute {
  // 路径
  pathname: string;
  // 名称
  name?: string;
  // 中文描述，可用于侧栏列表
  title: string;
  // react组件函数
  component: FC;
  // 页面组件创建时执行的hook
  beforeCreate?: (route: IRoute) => void;
  // 页面组件销毁时执行的hook
  beforeDestroy?: (route: IRoute) => void;
  // 属性
  meta?: IMetaProps;
  children?: IRoute[];
  redirect?: IRedirectProps;
}
