<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="colunm-info row mb-4 border-bottom pb-4 align-items-center">
      <div class="col-3 text-center">
        <img
          :src="column &&column.avatar && column.avatar.url"
          :alt="column && column.title"
          class="rounded-circle border w-100"
        >
      </div>
      <div class="col-9">
        <h4 v-if="column">{{column.title}}</h4>
        <div class="text-muted">{{column && column.description}}</div>
      </div>
    </div>
    <post-list :list="list"></post-list>
    <button
      v-if="!isLastPage"
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
      @click="loadMorePage"
    >
      加载更多
    </button>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
import PostList from '../components/PostList.vue'
import useLoadMore from '../hooks/useLoadMore'
export default defineComponent({
  components: { PostList },
  setup () {
    const route = useRoute()
    const currentId = ref(route.params.id)
    const store = useStore<GlobalDataProps>()
    const total = computed(() => {
      if (store.getters.getLoadedPost(currentId.value)) {
        return store.getters.getLoadedPost(currentId.value).total
      } else {
        return 0
      }
    })
    const currentPage = computed(() => {
      if (store.getters.getLoadedPost(currentId.value)) {
        return store.getters.getLoadedPost(currentId.value).currentPage
      } else {
        return 0
      }
    })
    const getColumnAndPosts = () => {
      store.dispatch('fetchColumn', currentId.value)
      store.dispatch('fetchPosts', { columnId: currentId.value })
    }
    onMounted(() => {
      getColumnAndPosts()
    })
    onBeforeRouteUpdate((to, from, next) => {
      currentId.value = to.params.id
      getColumnAndPosts()
      next()
    })
    const column = computed(() => store.getters.getColumnById(currentId.value))
    const list = computed(() => store.getters.getPostsByCid(currentId.value))
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, {
      pageSize: 6,
      currentPage: currentPage.value ? currentPage.value + 1 : 2,
      columnId: currentId.value as string
    })
    return {
      column,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style  scoped>
</style>
