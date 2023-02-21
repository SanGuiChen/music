import { FC, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { IRoute } from '@/types/router';
import routes from './routes';
import { isLogin } from '@/utils';
import notFoundIcon from '@/assets/404.svg';

const ErrorBlock = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div>
        <img src={notFoundIcon} alt="404 Not Found" />
        <p className="font-mono text-center text-green-900 text-xl">
          404 找不到路径~
        </p>
      </div>
    </div>
  );
};

// 路由装饰器
const RouteDecorator = (props: { route: IRoute }) => {
  const { route } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (route?.title) {
      document.title = route.title;
    }
    // 鉴权路由守卫
    if (route.meta?.requireAuth) {
      if (!isLogin()) {
        navigate('/', { state: { redirect: route.pathname } });
      }
    }

    // 自定义路由守卫
    route.beforeCreate && route.beforeCreate(route);
    return () => route.beforeDestroy && route.beforeDestroy(route);
  }, [route]);

  return <route.component />;
};

const RouterComponent: FC = () => (
  <Routes>
    <Route path="/index" element={<Navigate to="/" />} />
    <Route path="*" element={<ErrorBlock />} />
    {routes.map((route) => (
      <Route
        key={route.pathname}
        path={route.pathname}
        element={<RouteDecorator route={route} />}
      />
    ))}
  </Routes>
);

export default RouterComponent;
