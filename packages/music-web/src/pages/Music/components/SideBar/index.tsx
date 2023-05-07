import { uniqueIdGenerator } from '@/utils';
import { CustomerServiceOutlined, HeartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface IProps {
  className?: string;
}

const SideBar: React.FC<IProps> = ({}) => {
  const generateMenuId = uniqueIdGenerator('music_sideBar_item');
  const { pathname } = useLocation();

  const menuItems = [
    {
      label: <Link to="discovery">发现音乐</Link>,
      key: generateMenuId.next().value,
      url: '/discovery',
      icon: <CustomerServiceOutlined />
    },
    {
      label: <Link to="love">我的喜欢</Link>,
      key: generateMenuId.next().value,
      url: '/love',
      icon: <HeartOutlined />
    }
  ];

  const menuKeysObj: Record<string, string> = {};
  menuItems.forEach((item) => {
    const { key, url } = item;
    menuKeysObj[url] = key;
  });

  return (
    <Menu
      mode="inline"
      items={menuItems}
      className="w-1/6 bg-gray-100"
      selectedKeys={
        menuKeysObj[`/${pathname.replace('/music', '').split('/')[1]}`]
          ? [menuKeysObj[`/${pathname.replace('/music', '').split('/')[1]}`]]
          : undefined
      }
    />
  );
};

export default SideBar;
