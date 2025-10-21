import i18next from 'i18next';

class FormView {
  constructor(elements) {
    this.elements = elements;
    this.currentPost = null;
  }

  init() {
    this.elements.input.addEventListener('input', () => {
      this.clearValidation();
    });

    // Инициализируем модальное окно
    this.initModal();
  }

  initModal() {
    // Находим элементы модального окна
    this.modal = {
      element: document.getElementById('modal'),
      title: document.querySelector('.modal-title'),
      body: document.querySelector('.modal-body'),
      fullArticleLink: document.querySelector('.full-article'),
      closeBtn: document.querySelector('.btn-secondary'),
    };

    // Добавляем обработчики закрытия
    if (this.modal.closeBtn) {
      this.modal.closeBtn.addEventListener('click', () => {
        this.hideModal();
      });
    }

    // Закрытие по клику вне модального окна
    if (this.modal.element) {
      this.modal.element.addEventListener('click', (e) => {
        if (e.target === this.modal.element) {
          this.hideModal();
        }
      });
    }
  }

  render(state, path, value) {
    if (path === 'feeds' || path === 'posts') {
      this.renderFeedsAndPosts(state);
    }

    if (path.startsWith('form')) {
      this.handleFormState(state.form);
    }

    if (path === 'form.url') {
      this.elements.input.value = state.form.url;
    }
  }

  handleFormState(formState) {
    const { input, submit } = this.elements;
    
    if (formState.processState === 'sending') {
      submit.disabled = true;
      input.disabled = true;
      this.clearValidation();
    } else {
      submit.disabled = false;
      input.disabled = false;
    }

    if (formState.processState === 'error' && formState.errorCode) {
      const errorMessage = i18next.t(formState.errorCode);
      this.showValidation(errorMessage, 'error');
    } else if (formState.processState === 'finished') {
      const successMessage = i18next.t('success');
      this.showValidation(successMessage, 'success');
      
      input.value = '';
      input.focus();
      
      setTimeout(() => {
        this.clearValidation();
      }, 3000);
    } else {
      this.clearValidation();
    }
  }

  renderFeedsAndPosts(state) {
    this.renderFeeds(state.feeds);
    this.renderPosts(state.posts);
  }

  renderFeeds(feeds) {
    const { feedsContainer } = this.elements;
    
    if (feeds.length === 0) {
      feedsContainer.innerHTML = '<p class="text-muted">Нет добавленных фидов</p>';
      return;
    }

    const feedsHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Фиды</h5>
          <div class="list-group list-group-flush">
            ${feeds.map(feed => `
              <div class="list-group-item">
                <h6 class="mb-1">${this.escapeHtml(feed.title)}</h6>
                <p class="mb-1 text-muted small">${this.escapeHtml(feed.description)}</p>
                <small class="text-muted">Обновляется автоматически</small>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    feedsContainer.innerHTML = feedsHTML;
  }

  renderPosts(posts) {
    const { postsContainer } = this.elements;
    
    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="text-muted">Нет постов для отображения</p>';
      return;
    }

    const postsHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Посты</h5>
          <div class="list-group list-group-flush">
            ${posts.map(post => `
              <div class="list-group-item d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <a href="${this.escapeHtml(post.link)}" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     class="text-decoration-none">
                    <h6 class="mb-1">${this.escapeHtml(post.title)}</h6>
                  </a>
                  <p class="mb-1 text-muted small">${this.escapeHtml(post.description)}</p>
                </div>
                <button type="button" 
                        class="btn btn-outline-primary btn-sm ms-3" 
                        data-post-id="${post.id}"
                        data-bs-toggle="modal" 
                        data-bs-target="#modal">
                  Просмотр
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    postsContainer.innerHTML = postsHTML;

    // Добавляем обработчики для кнопок "Просмотр"
    this.attachPreviewHandlers(posts);
  }

  attachPreviewHandlers(posts) {
    const previewButtons = this.elements.postsContainer.querySelectorAll('button[data-post-id]');
    
    previewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = button.getAttribute('data-post-id');
        const post = posts.find(p => p.id === postId);
        
        if (post) {
          this.showModal(post);
        }
      });
    });
  }

  showModal(post) {
    if (!this.modal.element) return;

    this.currentPost = post;

    // Заполняем модальное окно данными поста
    this.modal.title.textContent = this.escapeHtml(post.title);
    this.modal.body.textContent = this.escapeHtml(post.description);
    this.modal.fullArticleLink.href = post.link;

    // Показываем модальное окно
    this.modal.element.classList.add('show');
    this.modal.element.style.display = 'block';
    this.modal.element.setAttribute('aria-hidden', 'false');
    
    // Добавляем backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
  }

  hideModal() {
    if (!this.modal.element) return;

    // Скрываем модальное окно
    this.modal.element.classList.remove('show');
    this.modal.element.style.display = 'none';
    this.modal.element.setAttribute('aria-hidden', 'true');
    
    // Убираем backdrop
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.style.overflow = 'auto';
    
    this.currentPost = null;
  }

  showValidation(message, type = 'error') {
    const { input, feedback } = this.elements;
    
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

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

export default FormView;