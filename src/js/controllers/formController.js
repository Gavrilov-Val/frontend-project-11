import validateUrl from '../utils/validation.js';

class FormController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.view.init();
    this.view.elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  handleSubmit() {
    const url = this.view.getFormData();
    const feeds = this.model.getFeeds();
    
    console.log('Submit handled, url:', url);

    // Проверка на пустую строку перед валидацией
    if (!url.trim()) {
      console.log('Empty URL detected');
      this.model.setFormState({ 
        processState: 'error',
        error: 'Ссылка не должна быть пустой' 
      });
      return;
    }

    this.model.setFormState({ 
      url, 
      processState: 'sending',
      error: null 
    });

    validateUrl(url, feeds)
      .then(() => {
        console.log('Validation successful');
        this.model.addFeed(url);
        this.model.resetForm();
        this.model.setFormState({ processState: 'finished' });
      })
      .catch((error) => {
        console.log('Validation error:', error.message);
        this.model.setFormState({ 
          processState: 'error',
          error: error.message 
        });
      });
  }
}

export default FormController;