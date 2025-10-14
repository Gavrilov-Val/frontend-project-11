import i18next from 'i18next'
import resources from '../locales/index.js'

const i18n = () => {
  return i18next.init({
    lng: 'ru',
    debug: false,
    resources,
  })
}

export default i18n
