import axios from 'axios'

const loadRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  return axios.get(proxyUrl, { timeout: 10000 })
    .then((response) => {
      if (response.data.contents) {
        return response.data.contents
      }
      throw new Error('errors.network')
    })
    .catch((error) => {
      if (error.code === 'ECONNABORTED') {
        throw new Error('errors.network')
      }
      throw new Error('errors.network')
    })
}

export default loadRSS
