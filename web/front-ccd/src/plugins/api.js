import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  install: (app) => {
    app.config.globalProperties.$api = apiClient
  }
}