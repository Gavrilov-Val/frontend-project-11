class FormModel {
  constructor(watchedState) {
    this.state = watchedState
  }

  getFeeds() {
    return this.state.feeds
  }

  addFeed(url) {
    this.state.feeds.push(url)
  }

  getFormState() {
    return this.state.form
  }

  setFormState(newState) {
    this.state.form = { ...this.state.form, ...newState }
  }

  resetForm() {
    this.state.form = {
      url: '',
      error: null,
      errorCode: null, // Добавляем код ошибки
      valid: true,
      processState: 'filling',
    }
  }

  // Новый метод для установки ошибки с кодом
  setError(errorCode) {
    this.state.form.errorCode = errorCode
    this.state.form.processState = 'error'
  }
}

export default FormModel
