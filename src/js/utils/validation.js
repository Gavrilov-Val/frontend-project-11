import * as yup from 'yup';

const validateUrl = (url, feedsList) => {
  const schema = yup.string()
    .required('Ссылка не должна быть пустой')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(feedsList, 'RSS уже существует');

  return schema.validate(url);
};

export default validateUrl;