import * as yup from 'yup'
import i18next from 'i18next'

const validateUrl = (url, feedsList) => {
  const schema = yup.string()
    .required('errors.required')
    .url('errors.url')
    .notOneOf(feedsList, 'errors.notOneOf')

  return schema.validate(url)
}

export default validateUrl
