import { createStore, Commit } from 'vuex'
import { ColumnProps, PostProps, UserProps } from './testData'
import axios, { AxiosRequestConfig } from 'axios'

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = {
  method: 'get'
}) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  getters: {
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.find(post => post._id === id)
    }
  },
  mutations: {
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    fetchPost (state, rawData) {
      state.posts = [rawData.data]
    },
    updatePost (state, { data }) {
      state.posts = state.posts.map(post => {
        if (post._id === data._id) {
          return data
        } else {
          return post
        }
      })
    },
    setLoading (state, status) {
      state.loading = status
    },
    fetchCurrentUser (state, rawData) {
      state.user = { ...rawData.data, isLogin: true }
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      asyncAndCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      asyncAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    fetchPost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  }
})
export default store
