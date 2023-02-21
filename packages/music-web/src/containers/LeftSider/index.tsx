import { generateUniqueId } from '@/utils';
import {
  CloudDownloadOutlined,
  EditOutlined,
  FileOutlined,
  PicRightOutlined,
  ScissorOutlined,
  SearchOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import _ from 'lodash';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IMenuItem {
  label: React.ReactNode;
  url?: string;
  icon?: React.ReactNode;
  children?: IMenuItem[];
}

type MenuItem = Required<MenuProps>['items'][number];
const urlObj: Record<string, string> = {};
const generateMenuId = generateUniqueId('menu_item');

const items: IMenuItem[] = [
  {
    label: '元数据管理',
    icon: <SettingOutlined />,
    children: [
      {
        label: '音乐检索',
        url: '/search',
        icon: <SearchOutlined />
      },
      {
        label: '音乐下架',
        url: '/offline',
        icon: <CloudDownloadOutlined />
      }
    ]
  },
  {
    label: '音乐生产',
    icon: <PicRightOutlined />,
    children: [
      {
        label: '制作模块',
        icon: <EditOutlined />
      },
      {
        label: '审核模块',
        icon: <ScissorOutlined />
      },
      {
        label: '任务模块',
        icon: <FileOutlined />
      }
    ]
  }
];

const menuItems = ((): MenuItem[] =>
  items.map((item) => {
    const key = generateMenuId.next().value;
    if (item?.url) {
      urlObj[key] = item.url;
    }
    if (item?.children) {
      const childrenItems = item.children.map((i) => {
        const childrenKey = generateMenuId.next().value;
        if (i?.url) {
          urlObj[childrenKey] = i.url;
        }
        return {
          ...i,
          key: childrenKey
        };
      });
      return {
        ...item,
        children: childrenItems,
        key
      };
    }
    return {
      ...item,
      key
    };
  }))();

const Index = () => {
  const navigate = useNavigate();

  return (
    <Sider width={200} collapsible theme="light">
      <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => {
          const url = urlObj[key];
          if (url) {
            navigate(url);
          }
        }}
      />
    </Sider>
  );
};

export default Index;
