import onChange from 'on-change';

class WatchedView {
  constructor(state, template) {
    console.log('WatchedView created with template:', typeof template);
    this.state = onChange(state, (path, value) => {
      console.log('State changed:', path, value);
      if (typeof template === 'function') {
        template(this.state, path, value);
      } else {
        console.error('Template is not a function:', template);
      }
    });
    this.template = template;
  }

  getWatchedState() {
    return this.state;
  }
}

export default WatchedView;