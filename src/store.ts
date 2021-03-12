import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
interface UserProps{
    isLogin: boolean;
    name?: string;
    id?: string;
    columnId?: number;
}
export interface GlobalDataProps{
    columns: ColumnProps[];
    posts: PostProps[];
    user: UserProps;
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false, name: 'niuniu', columnId: 1 }
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      return state.columns.find(c => c.id === id)
    },
    getPostsByCid: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId === cid)
    }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'niuniu' }
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    }
  }
})
export default store
