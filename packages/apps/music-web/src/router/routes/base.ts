import ReactLazilyComponent from 'react-lazily-component'

// 页面路由配置
const BaseRoutes = [
  {
    pathname: '/',
    component: ReactLazilyComponent(() => import('@/pages/index'))
  },
  {
    pathname: '/index',
    name: 'Index',
    title: '首页',
    component: ReactLazilyComponent(() => import('@/pages/index')),
    meta: {
      navigation: '首页'
    }
  }
]

export default BaseRoutes
