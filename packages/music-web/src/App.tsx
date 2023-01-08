import React from 'react';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined
} from '@ant-design/icons';
import { ConfigProvider, MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import RouterComponent from './router';
import Login from './pages/Base/Login';
import zhCN from 'antd/locale/zh_CN';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`
}));

const items2: MenuProps['items'] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`
      };
    })
  };
});

type ThemeData = {
  colorPrimary: string;
};

const defaultData: ThemeData = {
  colorPrimary: '#417505'
};

const App: React.FC = () => {
  const [data, setData] = React.useState<ThemeData>(defaultData);
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: data.colorPrimary
        }
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Login />
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items1}
          />
        </Header>
        <Layout>
          <Sider width={200} collapsible>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
              items={items2}
            />
          </Sider>
          <Layout>
            <Content>
              <RouterComponent />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
