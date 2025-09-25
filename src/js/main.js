import initApp from './app.js'

// Добавляем обработчик события DOMContentLoaded
const initialize = () => {
  document.addEventListener('DOMContentLoaded', () => {
    initApp()
  })
}

initialize()
