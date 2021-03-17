import { createStore, Commit } from 'vuex'
import { ColumnProps, PostProps, UserProps, ListProps } from './testData'
import { arrayToObj, objToArr } from './helper'
import axios, { AxiosRequestConfig } from 'axios'

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalColumns {
  data: ListProps<ColumnProps>;
  total: number;
  currentPage: number;
}
export interface GlobalPosts {
  data: ListProps<PostProps>;
  loadedColumns: ListProps<{ columnId?: string; total?: number; currentPage?: number }>;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: GlobalColumns;
  posts: GlobalPosts;
  user: UserProps;
}
const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = {
    method: 'get'
  },
  extraData?: any
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, total: 0, currentPage: 0 },
    posts: { data: {}, loadedColumns: {} },
    user: { isLogin: false }
  },
  getters: {
    getColumns: (state) => {
      return objToArr(state.columns.data)
    },
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id]
    },
    getPostsByCid: (state) => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
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
    updateUser (state, rawData) {
      state.user = { ...rawData.data, isLogin: true }
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrayToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    updateColonm (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      const { list, count, currentPage } = rawData.data
      state.posts.data = { ...state.posts.data, ...arrayToObj(list) }
      state.posts.loadedColumns[columnId] = {
        columnId,
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    fetchCurrentUser (state, rawData) {
      state.user = { ...rawData.data, isLogin: true }
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      } else {
        return Promise.resolve({ data: state.columns.data[cid] })
      }
    },
    updateColonm ({ commit }, { id, payload }) {
      return asyncAndCommit(`/columns/${id}`, 'updateColonm', commit, {
        method: 'patch',
        data: payload
      })
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6, columnId } = params
      const loadedPost = state.posts.loadedColumns[columnId]
      if (!loadedPost) {
        return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(`/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
        }
      }
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/user/login', 'login', commit, { method: 'post', data: payload })
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('/posts', 'createPost', commit, { method: 'post', data: payload })
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
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
    updateUser ({ commit }, { id, payload }) {
      return asyncAndCommit(`/user/${id}`, 'updateUser', commit, {
        method: 'patch',
        data: payload
      })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  }
})
export default store
