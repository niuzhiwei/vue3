<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link
      class="navbar-brand"
      to='/'
    >者也专栏</router-link>
    <ul
      v-if='!user.isLogin'
      class="list-inline mb-0"
    >
      <li class="list-inline-item">
        <router-link
          to='/login'
          class="btn btn-outline-light my-2"
        >登录</router-link>
      </li>
      <li class="list-inline-item">
        <router-link
          to="/signup"
          class="btn btn-outline-light my-2"
        >注册</router-link>
      </li>
    </ul>
    <ul
      v-else
      class="list-inline mb-0"
    >
      <li class="list-inline-item">
        <dropdown :title="`${user.nickName}`">
          <dropdown-item>
            <router-link
              class="dropdown-item"
              to='/create'
            >新建文章</router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link
              :to="`/column/${user.column}`"
              class="dropdown-item"
            >我的专栏</router-link>
          </dropdown-item>
          <dropdown-item>
            <router-link
              class="dropdown-item"
              to="/update"
            >编辑资料</router-link>
          </dropdown-item>
          <dropdown-item>
            <a
              class="dropdown-item"
              href="#"
              @click="logout"
            >退出登录</a>
          </dropdown-item>
        </dropdown>
      </li>
    </ul>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
import { UserProps } from '../testData'

export default defineComponent({
  name: 'GlobalHeader',
  components: { Dropdown, DropdownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const logout = () => {
      store.commit('logout')
      router.push('/')
    }
    return {
      logout
    }
  }
})
</script>
<style scoped>
</style>
