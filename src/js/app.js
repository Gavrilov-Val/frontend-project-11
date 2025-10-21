import '../scss/styles.scss'
import i18n from './utils/i18n.js'
import FormModel from './models/formModel.js'
import FormView from './views/formView.js'
import WatchedView from './views/watchedView.js'
import FormController from './controllers/formController.js'

const initApp = async () => {
  await i18n()

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  }

  const initialState = {
    feeds: [],
    posts: [],
    form: {
      url: '',
      errorCode: null,
      valid: true,
      processState: 'filling',
    },
  }

  const formView = new FormView(elements)
  const watchedView = new WatchedView(initialState, formView.render.bind(formView))
  const model = new FormModel(watchedView.getWatchedState())
  const controller = new FormController(model, formView)

  console.log('RSS Aggregator with feeds/posts initialized!')
}

export default initApp
