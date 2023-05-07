import MusicSvg from '@/assets/music.svg';
import I18nIcon from '@/assets/i18n.svg';
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Space,
  Tooltip,
  Typography
} from 'antd';
import { EditOutlined, GithubFilled, LogoutOutlined } from '@ant-design/icons';
import { uniqueIdGenerator } from '@/utils';
import { useTranslation } from 'react-i18next';
import { LangEnum } from '@/locales/config';
import { LANG, MUSIC_TOKEN } from '@/constants';
import { Locale } from 'antd/es/locale';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useNavigate } from 'react-router-dom';
import { RoleEnumTextMap, useUserStore } from '@/store/user';
import EditUserModal from '@/pages/User';
import { useState } from 'react';
import TopSider from '../TopSider';

interface IProps {
  setLang: React.Dispatch<React.SetStateAction<Locale>>;
}

const { Text } = Typography;

const Index: React.FC<IProps> = ({ setLang }) => {
  const menuGenerateId = uniqueIdGenerator('user-menu-item');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const language = i18n.language;

  const items: MenuProps['items'] = [
    {
      key: menuGenerateId.next().value,
      label: (
        <Text style={{ width: '100%' }} ellipsis={{ tooltip: user.nickname }}>
          {t('NICKNAME')}：{user.nickname}
        </Text>
      )
    },
    {
      key: menuGenerateId.next().value,
      label: (
        <Text style={{ width: '100%' }} ellipsis={{ tooltip: user.email }}>
          {t('EMAIL')}：{user.email}
        </Text>
      )
    },
    {
      key: menuGenerateId.next().value,
      label: (
        <>
          {t('ROLE')}：{RoleEnumTextMap(user.role) || '-'}
        </>
      )
    },
    {
      key: menuGenerateId.next().value,
      label: (
        <div className="flex justify-center">
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            onClick={() => {
              setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem(MUSIC_TOKEN);
              location.reload();
            }}
          >
            退出
          </Button>
        </div>
      )
    }
  ];

  const handleChangeLang = () => {
    if (language === LangEnum.ZH_CN) {
      i18n.changeLanguage(LangEnum.EN);
      setLang(enUS);
      window.localStorage.setItem(LANG, LangEnum.EN);
    } else {
      i18n.changeLanguage(LangEnum.ZH_CN);
      setLang(zhCN);
      window.localStorage.setItem(LANG, LangEnum.ZH_CN);
    }
  };

  return (
    <div className="w-full h-55 px-3 bg-white border-b-1 border-gray-50 flex items-center justify-between shadow-xl z-10">
      <div className="cursor-pointer flex items-center">
        <div
          onClick={() => {
            navigate('/');
          }}
          className="mr-2 flex"
        >
          <img src={MusicSvg} alt="" className="w-12 inline-block" />
          &nbsp;
          <span className="text-gray-900 text-2xl mt-4 font-mono italic block">
            Music
          </span>
        </div>

        <TopSider className="w-200px h-full" />
      </div>

      <Space size="small">
        <Tooltip
          placement="bottom"
          title={
            language === LangEnum.ZH_CN
              ? t('SWITCH_INTO_ENGLISH')
              : t('SWITCH_INTO_CHINESE')
          }
        >
          <Button type="text" onClick={handleChangeLang}>
            <img src={I18nIcon} alt="i18n" width={20} />
          </Button>
        </Tooltip>

        <Tooltip placement="bottom" title={'Go to Github!'}>
          <Button
            type="text"
            href="https://github.com/xuchen-cx/music"
            target="_blank"
            rel="noreferrer"
          >
            <GithubFilled key="GithubFilled" width={20} />
          </Button>
        </Tooltip>

        <Dropdown menu={{ items }}>
          <Avatar src={user?.avatar} style={{ cursor: 'pointer' }} />
        </Dropdown>
      </Space>
      <EditUserModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
        }}
      />
    </div>
  );
};

export default Index;
