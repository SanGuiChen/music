import { IRoute } from '@/types/router';
import ReactLazilyComponent from 'react-lazily-component';

const ManagementRoutes: IRoute[] = [
  {
    pathname: '/search',
    component: ReactLazilyComponent(() => import('@/pages/search')),
    name: 'Welcome',
    title: '音乐检索',
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/offline',
    name: 'Welcome',
    title: '音乐下架',
    component: ReactLazilyComponent(() => import('@/pages/offline')),
    meta: {
      requireAuth: true
    }
  }
];

export default ManagementRoutes;
