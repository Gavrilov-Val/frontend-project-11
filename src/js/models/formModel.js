class FormModel {
  constructor(watchedState) {
    // Используем переданное наблюдаемое состояние
    this.state = watchedState;
  }

  getFeeds() {
    return this.state.feeds;
  }

  addFeed(url) {
    this.state.feeds.push(url);
  }

  getFormState() {
    return this.state.form;
  }

  setFormState(newState) {
    // Изменения автоматически будут отслеживаться через on-change
    this.state.form = { ...this.state.form, ...newState };
  }

  resetForm() {
    this.state.form = {
      url: '',
      error: null,
      valid: true,
      processState: 'filling',
    };
  }
}

export default FormModel;