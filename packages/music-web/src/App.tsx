import React, { useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import { Layout } from 'antd';
import Login from './pages/Base/Login';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import Content from './containers/Content';
import Header from './containers/Header';
import LeftSider from './containers/LeftSider';
import { Locale } from 'antd/es/locale-provider';
import { LangEnum } from './locales/config';
import { LANG } from './constants';
import { useTranslation } from 'react-i18next';
import { useUserStore } from './store/user';
import { isEmpty } from 'lodash';

type ThemeData = {
  colorPrimary: string;
};

const defaultData: ThemeData = {
  colorPrimary: '#417505'
};

const App: React.FC = () => {
  const [data, setData] = useState<ThemeData>(defaultData);
  const [lang, setLang] = useState<Locale>(zhCN);
  const { i18n } = useTranslation();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const lang = window.localStorage.getItem(LANG);
    if (lang === LangEnum.EN) {
      setLang(enUS);
      i18n.changeLanguage(LangEnum.EN);
    } else {
      setLang(zhCN);
      i18n.changeLanguage(LangEnum.ZH_CN);
      window.localStorage.setItem(LANG, LangEnum.ZH_CN);
    }
  }, []);

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
        {isEmpty(user) && <Login />}
        <Header setLang={setLang} />
        <Layout>
          <LeftSider />
          <Content className=" overflow-scroll p-5" />
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
