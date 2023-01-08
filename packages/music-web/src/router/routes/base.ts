import { IRoute } from '@/types/router'
import ReactLazilyComponent from 'react-lazily-component'

// 页面路由配置
const BaseRoutes: IRoute[] = [
  {
    pathname: '/',
    component: ReactLazilyComponent(() => import('@/pages/Base/Welcome'))
  },
  {
    pathname: '/index',
    name: 'Welcome',
    title: '首页',
    component: ReactLazilyComponent(() => import('@/pages/Base/Welcome')),
    meta: {
      navigation: '首页'
    }
  }
]

export default BaseRoutes
