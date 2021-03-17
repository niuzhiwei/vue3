import { useStore } from 'vuex'
import { ref, computed, ComputedRef } from 'vue'

interface LoadParams {
    currentPage: number;
    pageSize: number;
    columnId?: string;
}
const useLoadMore = (actionName: string, total: ComputedRef<number>, params: LoadParams = { pageSize: 6, currentPage: 2 }) => {
  const store = useStore()
  const { pageSize, currentPage: current, columnId } = params
  const currentPage = ref(current)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize,
    columnId
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams.value).then(() => {
      currentPage.value += 1
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
