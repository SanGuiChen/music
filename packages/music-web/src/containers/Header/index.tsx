import MusicSvg from '@/assets/music.svg';
import I18nIcon from '@/assets/i18n.svg';
import { Button, Dropdown, MenuProps, Space, Tooltip } from 'antd';
import { GithubFilled, UserOutlined } from '@ant-design/icons';
import { uniqueIdGenerator } from '@/utils';
import { useTranslation } from 'react-i18next';
import { LangEnum } from '@/locales/config';
import { LANG } from '@/constants';
import { Locale } from 'antd/es/locale';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { useNavigate } from 'react-router-dom';

interface IProps {
  setLang: React.Dispatch<React.SetStateAction<Locale>>;
}

const Index: React.FC<IProps> = ({ setLang }) => {
  const menuGenerateId = uniqueIdGenerator('user-menu-item');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const language = i18n.language;

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
    <div className="w-full h-55 px-3 bg-white border-b-1 border-gray-300 flex items-center justify-between shadow-xl z-10">
      <div
        onClick={() => {
          navigate('/');
        }}
        className="cursor-pointer"
      >
        <img src={MusicSvg} alt="" className="w-12 inline-block" />
        &nbsp;
        <span className="text-gray-900 text-2xl font-mono italic">Music</span>
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
          <Button type="text">
            <UserOutlined width={20} />
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
};

export default Index;
