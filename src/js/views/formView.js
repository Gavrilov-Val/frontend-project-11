class FormView {
  constructor(elements) {
    this.elements = elements;
  }

  init() {
    this.elements.input.addEventListener('input', () => {
      this.clearValidation();
    });
  }

  render(state, path, value) {
    console.log('FormView render called with path:', path, 'value:', value);
    
    // Обрабатываем изменения в форме
    if (path.startsWith('form')) {
      this.handleFormState(state.form);
    }

    // Обновляем значение input при изменении URL
    if (path === 'form.url') {
      this.elements.input.value = state.form.url;
    }
  }

  handleFormState(formState) {
    const { input, submit } = this.elements;
    console.log('Processing form state:', formState.processState, 'error:', formState.error);
    
    // Управление состоянием элементов формы
    if (formState.processState === 'sending') {
      submit.disabled = true;
      input.disabled = true;
      this.clearValidation();
    } else {
      submit.disabled = false;
      input.disabled = false;
    }

    // Обработка ошибок
    if (formState.processState === 'error' && formState.error) {
      this.showValidation(formState.error, 'error');
    } else if (formState.processState === 'finished') {
      // Показываем успешное уведомление
      this.showValidation('RSS успешно загружен', 'success');
      
      // Очистка после успешной отправки
      input.value = '';
      input.focus();
      
      // Автоматически скрываем успешное уведомление через 3 секунды
      setTimeout(() => {
        this.clearValidation();
      }, 3000);
    } else {
      this.clearValidation();
    }
  }

  showValidation(message, type = 'error') {
    const { input, feedback } = this.elements;
    console.log('Showing validation:', type, message);
    
    if (type === 'error') {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      feedback.textContent = message;
      feedback.className = 'feedback m-0 position-absolute small text-danger';
      feedback.style.display = 'block';
    } else if (type === 'success') {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      feedback.textContent = message;
      feedback.className = 'feedback m-0 position-absolute small text-success';
      feedback.style.display = 'block';
    }
  }

  clearValidation() {
    const { input, feedback } = this.elements;
    
    input.classList.remove('is-invalid', 'is-valid');
    feedback.textContent = '';
    feedback.style.display = 'none';
  }

  getFormData() {
    const formData = new FormData(this.elements.form);
    return formData.get('url').trim();
  }
}

export default FormView;