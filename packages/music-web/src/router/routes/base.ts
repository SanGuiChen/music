import { IRoute } from '@/types/router';
import ReactLazilyComponent from 'react-lazily-component';

const BaseRoutes: IRoute[] = [
  {
    pathname: '/index',
    component: ReactLazilyComponent(() => import('@/pages/base/Welcome'))
  },
  {
    pathname: '/',
    name: 'Welcome',
    title: '首页',
    component: ReactLazilyComponent(() => import('@/pages/base/Welcome')),
    meta: {
      navigation: '首页'
    }
  }
];

export default BaseRoutes;
