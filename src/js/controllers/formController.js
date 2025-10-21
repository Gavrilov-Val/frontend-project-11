import validateUrl from '../utils/validation.js';
import loadRSS from '../utils/loader.js';
import parseRSS from '../utils/parser.js';
import RSSUpdater from '../utils/updater.js';

class FormController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.updater = new RSSUpdater(model, view);
    this.init();
  }

  init() {
    this.view.init();
    this.view.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Запускаем автообновление при инициализации
    this.updater.start();
  }

  handleSubmit() {
    const url = this.view.getFormData();
    const feedsUrls = this.model.getFeedsUrls();

    if (!url.trim()) {
      this.model.setError('errors.required');
      return;
    }

    this.model.setFormState({ 
      url, 
      processState: 'sending',
      errorCode: null,
    });

    validateUrl(url, feedsUrls)
      .then(() => loadRSS(url))
      .then((xmlString) => parseRSS(xmlString))
      .then(({ feed, posts }) => {
        const newFeed = this.model.addFeed({
          ...feed,
          url,
        });
        
        this.model.addPosts(posts, newFeed.id);
        this.model.resetForm();
        this.model.setFormState({ processState: 'finished' });
      })
      .catch((error) => {
        const errorCode = error.message;
        this.model.setError(errorCode);
      });
  }

  // Метод для остановки автообновления (например, при закрытии приложения)
  destroy() {
    this.updater.stop();
  }
}

export default FormController;