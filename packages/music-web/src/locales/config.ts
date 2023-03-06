import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation_en from './en';
import translation_zh from './zh-CN';

export enum LangEnum {
  EN = 'en',
  ZH_CN = 'zh-CN'
}

const resources = {
  [LangEnum.EN]: {
    translation: translation_en
  },
  [LangEnum.ZH_CN]: {
    translation: translation_zh
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: LangEnum.ZH_CN,
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
