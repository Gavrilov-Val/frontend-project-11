import i18next from 'i18next'

class FormView {
  constructor(elements) {
    this.elements = elements
  }

  init() {
    this.elements.input.addEventListener('input', () => {
      this.clearValidation()
    })
  }

  render(state, path, value) {
    if (path.startsWith('form')) {
      this.handleFormState(state.form)
    }

    if (path === 'form.url') {
      this.elements.input.value = state.form.url
    }
  }

  handleFormState(formState) {
    const { input, submit } = this.elements

    if (formState.processState === 'sending') {
      submit.disabled = true
      input.disabled = true
      this.clearValidation()
    }
    else {
      submit.disabled = false
      input.disabled = false
    }

    if (formState.processState === 'error' && formState.errorCode) {
      const errorMessage = i18next.t(formState.errorCode)
      this.showValidation(errorMessage, 'error')
    }
    else if (formState.processState === 'finished') {
      const successMessage = i18next.t('success')
      this.showValidation(successMessage, 'success')

      input.value = ''
      input.focus()

      setTimeout(() => {
        this.clearValidation()
      }, 3000)
    }
    else {
      this.clearValidation()
    }
  }

  showValidation(message, type = 'error') {
    const { input, feedback } = this.elements

    if (type === 'error') {
      input.classList.add('is-invalid')
      input.classList.remove('is-valid')
      feedback.textContent = message
      feedback.className = 'feedback m-0 position-absolute small text-danger'
      feedback.style.display = 'block'
    }
    else if (type === 'success') {
      input.classList.add('is-valid')
      input.classList.remove('is-invalid')
      feedback.textContent = message
      feedback.className = 'feedback m-0 position-absolute small text-success'
      feedback.style.display = 'block'
    }
  }

  clearValidation() {
    const { input, feedback } = this.elements
    input.classList.remove('is-invalid', 'is-valid')
    feedback.textContent = ''
    feedback.style.display = 'none'
  }

  getFormData() {
    const formData = new FormData(this.elements.form)
    return formData.get('url').trim()
  }
}

export default FormView
