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
      this.showValidation(formState.error);
    } else if (formState.processState === 'finished') {
      // Очистка после успешной отправки
      input.value = '';
      input.focus();
      this.clearValidation();
    } else {
      this.clearValidation();
    }
  }

  showValidation(error) {
    const { input, feedback } = this.elements;
    console.log('Showing validation error:', error);
    console.log('Feedback element:', feedback);
    console.log('Input element:', input);
    
    // Добавляем класс ошибки к input
    input.classList.add('is-invalid');
    
    // Показываем текст ошибки
    feedback.textContent = error;
    feedback.style.display = 'block';
    feedback.style.visibility = 'visible';
    feedback.style.opacity = '1';
    
    // Проверяем, что стили применяются
    console.log('Feedback display style:', feedback.style.display);
    console.log('Feedback text content:', feedback.textContent);
  }

  clearValidation() {
    const { input, feedback } = this.elements;
    
    // Убираем класс ошибки
    input.classList.remove('is-invalid');
    
    // Скрываем текст ошибки
    feedback.textContent = '';
    feedback.style.display = 'none';
  }

  getFormData() {
    const formData = new FormData(this.elements.form);
    return formData.get('url').trim();
  }
}

export default FormView;