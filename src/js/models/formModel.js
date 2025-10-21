class FormModel {
  constructor(watchedState) {
    this.state = watchedState;
  }

  getFeedsUrls() {
    return this.state.feeds.map(feed => feed.url);
  }

  getFeeds() {
    return this.state.feeds;
  }

  addFeed(feedData) {
    const newFeed = {
      id: this.generateId(),
      ...feedData,
    };
    this.state.feeds.push(newFeed);
    return newFeed;
  }

  getPosts() {
    return this.state.posts;
  }

  addPosts(posts, feedId) {
    const existingLinks = this.state.posts.map(post => post.link);
    const newPosts = posts
      .filter(post => !existingLinks.includes(post.link))
      .map(post => ({
        id: this.generateId(),
        feedId,
        ...post,
      }));
    
    if (newPosts.length > 0) {
      this.state.posts.unshift(...newPosts); // Добавляем новые посты в начало
    }
    
    return newPosts;
  }

  getFormState() {
    return this.state.form;
  }

  setFormState(newState) {
    this.state.form = { ...this.state.form, ...newState };
  }

  resetForm() {
    this.state.form = {
      url: '',
      errorCode: null,
      valid: true,
      processState: 'filling',
    };
  }

  setError(errorCode) {
    this.state.form.errorCode = errorCode;
    this.state.form.processState = 'error';
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default FormModel;
