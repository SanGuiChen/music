import MusicSvg from '@/assets/music.svg';
import { Dropdown, MenuProps, Space, Tooltip } from 'antd';
import { GithubFilled, UserOutlined } from '@ant-design/icons';
import { generateUniqueId } from '@/utils';

const Index = () => {
  const menuGenerateId = generateUniqueId('user-menu-item');

  const items: MenuProps['items'] = [
    {
      key: menuGenerateId.next().value,
      label: <>用户名：</>
    },
    {
      key: menuGenerateId.next().value,
      label: <>用户名：</>
    },
    {
      key: menuGenerateId.next().value,
      label: <>用户名：</>
    },
    {
      key: menuGenerateId.next().value,
      label: <>用户名：</>
    }
  ];

  return (
    <div className="w-full h-55 px-3 bg-white border-b-1 border-gray-300 flex items-center justify-between shadow-xl">
      <div>
        <img src={MusicSvg} alt="" className="w-12 inline-block" />
        &nbsp;
        <span className="text-gray-900 text-2xl font-mono italic">Music</span>
      </div>
      <Space size="middle">
        <Tooltip placement="bottom" title={'Github'}>
          <a
            href="https://github.com/xuchen-cx/music"
            target="_blank"
            rel="noreferrer"
          >
            <GithubFilled key="GithubFilled" />
          </a>
        </Tooltip>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <UserOutlined />
          </a>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Index;
