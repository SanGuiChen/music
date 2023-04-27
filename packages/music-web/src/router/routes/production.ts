import { IRoute } from '@/types/router';
import ReactLazilyComponent from 'react-lazily-component';

const ProductionRoutes: IRoute[] = [
  {
    pathname: '/script',
    name: 'Script',
    title: '脚本模块',
    component: ReactLazilyComponent(() => import('@/pages/Script')),
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/production',
    name: 'Production',
    title: '音乐生产',
    component: ReactLazilyComponent(() => import('@/pages/Production/preview')),
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/production/:taskId',
    name: 'Production',
    title: '任务制作',
    component: ReactLazilyComponent(() => import('@/pages/Production')),
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/task',
    name: 'Task',
    title: '音乐任务',
    component: ReactLazilyComponent(() => import('@/pages/Task')),
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/task/:id',
    name: 'PersonalTask',
    title: '我的任务',
    component: ReactLazilyComponent(() => import('@/pages/Task/personalTask')),
    meta: {
      requireAuth: true
    }
  },
  {
    pathname: '/review',
    name: 'Review',
    title: '音乐审核',
    component: ReactLazilyComponent(() => import('@/pages/Review')),
    meta: {
      requireAuth: true
    }
  }
];

export default ProductionRoutes;
