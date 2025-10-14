import validateUrl from '../utils/validation.js'

class FormController {
  constructor(model, view) {
    this.model = model
    this.view = view
    this.init()
  }

  init() {
    this.view.init()
    this.view.elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleSubmit()
    })
  }

  handleSubmit() {
    const url = this.view.getFormData()
    const feeds = this.model.getFeeds()

    if (!url.trim()) {
      this.model.setError('errors.required')
      return
    }

    this.model.setFormState({
      url,
      processState: 'sending',
      errorCode: null,
    })

    validateUrl(url, feeds)
      .then(() => {
        this.model.addFeed(url)
        this.model.resetForm()
        this.model.setFormState({ processState: 'finished' })
      })
      .catch((error) => {
        // Получаем код ошибки из yup и передаем в модель
        const errorCode = error.message
        this.model.setError(errorCode)
      })
  }
}

export default FormController
