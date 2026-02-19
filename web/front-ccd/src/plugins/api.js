import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  install: (app) => {
    app.config.globalProperties.$api = apiClient
  }
}