import '../scss/styles.scss';
import FormModel from './models/formModel.js';
import FormView from './views/formView.js';
import WatchedView from './views/watchedView.js';
import FormController from './controllers/formController.js';

const initApp = () => {
  // Получаем DOM элементы
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
  };

  console.log('Found elements:', elements);
  console.log('Feedback element exists:', !!elements.feedback);
  console.log('Input element exists:', !!elements.input);

  // Начальное состояние
  const initialState = {
    feeds: [],
    form: {
      url: '',
      error: null,
      valid: true,
      processState: 'filling',
    },
  };

  // Сначала создаем View
  const formView = new FormView(elements);
  
  // Затем создаем WatchedView с правильной привязкой метода render
  const watchedView = new WatchedView(initialState, formView.render.bind(formView));
  
  // Потом создаем Model с наблюдаемым состоянием
  const model = new FormModel(watchedView.getWatchedState());
  
  // И наконец Controller
  const controller = new FormController(model, formView);

  console.log('RSS Aggregator initialized!');
};

export default initApp;