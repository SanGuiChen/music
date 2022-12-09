import { FC, useEffect } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { IRoute } from '@/types/router'
import routes from './routes'
// import { isLogin } from '@/utils/userLogin';

const isLogin = () => true
const ErrorBlock = () => {
  return <>error</>
}

// 路由装饰器
const RouteDecorator = (props: { route: IRoute }) => {
  const { route } = props
  const navigate = useNavigate()

  useEffect(() => {
    if (route?.title) {
      document.title = route.title
    }
    // 鉴权路由守卫
    if (route.meta?.requireAuth) {
      if (!isLogin()) {
        navigate('/login', { state: { redirect: route.pathname } })
      }
    }

    // 自定义路由守卫
    route.beforeCreate && route.beforeCreate(route)
    return () => route.beforeDestroy && route.beforeDestroy(route)
  }, [route])

  return <route.component />
}

const RouterComponent: FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/index" />} />
    <Route path="*" element={<ErrorBlock />} />
    {routes.map((route) => (
      <Route
        key={route.pathname}
        path={route.pathname}
        element={<RouteDecorator route={route} />}
      />
    ))}
  </Routes>
)

export default RouterComponent
