import { useTranslation } from 'react-i18next'

const Welcome = () => {
  const { t } = useTranslation()
  return (
    <div className="h-full flex items-center justify-center ">
      <span className="font-mono text-3xl text-gray-500">{t('WELCOME')}</span>
    </div>
  )
}

export default Welcome
