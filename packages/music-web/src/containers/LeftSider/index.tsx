import { uniqueIdGenerator } from '@/utils';
import {
  CloudDownloadOutlined,
  DownloadOutlined,
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
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

interface IMenuItem {
  label: React.ReactNode;
  url?: string;
  icon?: React.ReactNode;
  children?: IMenuItem[];
}

type MenuItem = Required<MenuProps>['items'][number];
const urlObj: Record<string, string> = {};
const keyObj: Record<string, string> = {};
const generateMenuId = uniqueIdGenerator('menu_item');

const Index = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const items: IMenuItem[] = useMemo(
    () => [
      {
        label: t('METADATA_MANAGEMENT'),
        icon: <SettingOutlined />,
        children: [
          {
            label: t('MUSIC_RETRIEVAL'),
            url: '/search',
            icon: <SearchOutlined />
          }
        ]
      },
      {
        label: t('MUSIC_PRODUCT'),
        icon: <PicRightOutlined />,
        children: [
          {
            label: t('MUSIC_PRODUCT'),
            url: '/production',
            icon: <EditOutlined />
          },
          {
            label: t('MUSIC_REVIEW'),
            url: '/review',
            icon: <ScissorOutlined />
          },
          {
            label: t('MUSIC_TASK'),
            url: '/task',
            icon: <FileOutlined />
          },
          {
            label: t('MUSIC_SCRIPT'),
            url: '/script',
            icon: <DownloadOutlined />
          }
        ]
      }
    ],
    [i18n.language]
  );

  const menuItems = useMemo((): MenuItem[] => {
    const opens: string[] = [];
    const menus = items.map((item) => {
      const key = generateMenuId.next().value;
      opens.push(key);
      if (item?.url) {
        urlObj[key] = item.url;
        keyObj[item.url] = key;
      }
      if (item?.children) {
        const childrenItems = item.children.map((i) => {
          const childrenKey = generateMenuId.next().value;
          if (i?.url) {
            urlObj[childrenKey] = i.url;
            keyObj[i.url] = childrenKey;
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
    });
    setOpenKeys([...opens]);
    return menus;
  }, [i18n.language]);

  return (
    <Sider width={200} collapsible theme="light">
      <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        openKeys={openKeys}
        selectedKeys={keyObj[pathname] ? [keyObj[pathname]] : undefined}
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
