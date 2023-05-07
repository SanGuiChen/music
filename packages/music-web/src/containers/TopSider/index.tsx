import { uniqueIdGenerator } from '@/utils';
import {
  CustomerServiceOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  ScissorOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

interface IProps {
  className?: string;
  style?: React.CSSProperties;
}

const Index: React.FC<IProps> = ({ className, style }) => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const generateMenuId = uniqueIdGenerator('menu_item');

  const items = useMemo(
    () => [
      {
        label: <Link to="/search">{t('MUSIC_RETRIEVAL')}</Link>,
        key: generateMenuId.next().value,
        icon: <SearchOutlined />,
        url: '/search'
      },
      {
        label: <Link to="/production">{t('MUSIC_PRODUCT')}</Link>,
        key: generateMenuId.next().value,
        icon: <EditOutlined />,
        url: '/production'
      },
      {
        label: <Link to="/review">{t('MUSIC_REVIEW')}</Link>,
        icon: <ScissorOutlined />,
        key: generateMenuId.next().value,
        url: '/review'
      },
      {
        label: <Link to="/task">{t('MUSIC_TASK')}</Link>,
        icon: <FileOutlined />,
        key: generateMenuId.next().value,
        url: '/task'
      },
      {
        label: <Link to="/script">{t('MUSIC_SCRIPT')}</Link>,
        icon: <DownloadOutlined />,
        key: generateMenuId.next().value,
        url: '/script'
      },
      {
        label: <Link to="/music/discovery">音乐畅听</Link>,
        icon: <CustomerServiceOutlined />,
        key: generateMenuId.next().value,
        url: '/music'
      }
    ],
    [i18n.language]
  );

  const menuKeysObj: Record<string, string> = {};
  items.forEach((item) => {
    const { key, url } = item;
    menuKeysObj[url] = key;
  });

  const selectedKey = useMemo(() => {
    return menuKeysObj[`/${pathname.split('/')[1]}`]
      ? [menuKeysObj[`/${pathname.split('/')[1]}`]]
      : undefined;
  }, [pathname]);

  return (
    <Menu
      mode="horizontal"
      className={className}
      style={style}
      selectedKeys={selectedKey}
      items={items}
    />
  );
};

export default Index;
