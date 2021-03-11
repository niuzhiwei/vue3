<template>
  <div class="container">
    <global-header :user='user'></global-header>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'

const currentUser: UserProps = {
  isLogin: true,
  name: 'niuniu',
  id: 1
}
const testData: ColumnProps[] = [
  {
    id: 1,
    title: '专栏1',
    description: '这是专栏这是专栏这是专栏这是专栏这是专栏这是专栏这是专栏',
    avatar:
      'https://pic3.zhimg.com/80/v2-283ce89cb6a57ee1c5745f2babf6b911_720w.jpg?source=1940ef5c'
  },
  {
    id: 2,
    title: '专栏2',
    description: '这是专栏2',
    avatar: ''
  },
  {
    id: 3,
    title: '专栏2',
    description: '这是专栏2',
    avatar:
      'https://pic3.zhimg.com/80/v2-283ce89cb6a57ee1c5745f2babf6b911_720w.jpg?source=1940ef5c'
  }
]
export default defineComponent({
  name: 'App',
  components: { ColumnList, GlobalHeader },
  setup () {
    return {
      list: testData,
      user: currentUser
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
