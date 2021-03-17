import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import store from './store'
import axios from 'axios'

// axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.defaults.baseURL = '/api'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'A0AEFEEC4B540896' }
  store.commit('setLoading', true)
  store.commit('setError', { status: false })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
