import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import { Layout } from 'antd';
import Login from './pages/base/Login';
import zhCN from 'antd/locale/zh_CN';
import Content from './containers/Content';
import Header from './containers/Header';
import LeftSider from './containers/LeftSider';
import { Locale } from 'antd/es/locale-provider';
import { isLogin } from './utils';

type ThemeData = {
  colorPrimary: string;
};

const defaultData: ThemeData = {
  colorPrimary: '#417505'
};

const App: React.FC = () => {
  const [data, setData] = useState<ThemeData>(defaultData);
  const [lang, setLang] = useState<Locale>(zhCN);

  return (
    <ConfigProvider
      locale={lang}
      theme={{
        token: {
          colorPrimary: data.colorPrimary
        }
      }}
    >
      <Layout style={{ height: '100vh' }}>
        {!isLogin() && <Login />}
        <Header />
        <Layout>
          <LeftSider />
          <Content />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
