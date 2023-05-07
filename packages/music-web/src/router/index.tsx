import { FC, Suspense, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { IRoute } from '@/types/router';
import routes from './routes';
import notFoundIcon from '@/assets/404.svg';
import { Spin, message } from 'antd';
import { isEmpty } from 'lodash';
import { RoleEnum, useUserStore } from '@/store/user';
import { useRequest } from 'ahooks';
import { isLogin } from '@/utils';

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
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const { loading } = useRequest(async () => {
    const user = await isLogin();
    if (!isEmpty(user)) {
      setUser(user);
    }
  });

  useEffect(() => {
    document.title = `Music-${route.title}`;
    if (!loading) {
      // 鉴权路由守卫
      if (route.meta?.requireAuth) {
        if (isEmpty(user)) {
          navigate('/', { state: { redirect: route.pathname } });
        }
      }
      if (route.meta?.onlyAdmin) {
        if (user?.role !== RoleEnum.SUPER_ADMIN) {
          message.warning('该页面需要管理员权限');
          navigate('/', { state: { redirect: route.pathname } });
        }
      }

      // 自定义路由守卫
      route.beforeCreate && route.beforeCreate(route);
      return () => route.beforeDestroy && route.beforeDestroy(route);
    }
  }, [route, loading]);

  return <route.component />;
};

const RouterComponent: FC = () => (
  <Suspense fallback={<Spin style={{ width: '100%', height: '100%' }} />}>
    <Routes>
      <Route path="/index" element={<Navigate to="/" />} />
      <Route path="*" element={<ErrorBlock />} />
      {routes.map((route) =>
        route?.children && route.children.length > 0 ? (
          <Route
            key={route.pathname}
            path={route.pathname}
            element={<RouteDecorator route={route} />}
          >
            {route.children.map((childrenRoute) => (
              <Route
                key={childrenRoute.pathname}
                path={childrenRoute.pathname}
                element={<RouteDecorator route={childrenRoute} />}
              />
            ))}
          </Route>
        ) : (
          <Route
            key={route.pathname}
            path={route.pathname}
            element={<RouteDecorator route={route} />}
          />
        )
      )}
    </Routes>
  </Suspense>
);

export default RouterComponent;
