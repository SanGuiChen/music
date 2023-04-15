import { IRoute } from '@/types/router';
import ReactLazilyComponent from 'react-lazily-component';

const ManagementRoutes: IRoute[] = [
  {
    pathname: '/search',
    component: ReactLazilyComponent(() => import('@/pages/Search')),
    name: 'Search',
    title: '音乐检索',
    meta: {
      requireAuth: true
    }
  }
];

export default ManagementRoutes;
