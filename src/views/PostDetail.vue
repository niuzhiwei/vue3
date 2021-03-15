<!--  -->
<template>
  <div class="post-detail-page">
    <article
      class="w-75 mx-auto mb-5 pb-3"
      v-if="currentPost"
    >
      <img
        :src="currentImageUrl"
        :alt="currentPost.title"
        class="rounded-lg img-fluid my-4"
      >
      <h2 class="mb-4">{{currentPost && currentPost.title}}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile
            :user="currentPost.author"
            v-if="typeof currentPost.author === 'object'"
          ></user-profile>
        </div>
        <span class="text-muted col text-right font-italic">发表于{{currentPost.createdAt}}</span>
      </div>
      <div v-html="currentHTML"></div>
      <div
        v-if="showEditArea"
        class="btn-group mt-5"
      >
        <router-link
          type="button"
          class="btn btn-success"
          :to="{name:'create',query:{id:currentPost._id}}"
        >编辑</router-link>
        <button
          type="button"
          class="btn btn-danger"
          @click.prevent="modalIsVisible = true"
        >删除</button>
      </div>
    </article>
    <modal
      title="删除文章"
      :visible="modalIsVisible"
      @modal-on-close="modalIsVisible = false"
      @modal-on-confirm="hideAndDelete"
    >
      <p>确定是否删除此文章？</p>
    </modal>
  </div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MarkdownIt from 'markdown-it'
import UserProfile from '../components/UserProfile.vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'
import { GlobalDataProps } from '../store'
import { UserProps, ResponseType, PostProps } from '../testData'
export default defineComponent({
  components: { UserProfile, Modal },
  setup () {
    const md = new MarkdownIt()
    const router = useRouter()
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id
    const modalIsVisible = ref(false)
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed(() => store.getters.getCurrentPost(currentId))
    const currentHTML = computed(() => {
      const { content, isHTML } = currentPost.value
      if (currentPost.value && content) {
        return isHTML ? content : md.render(content)
      }
      return ''
    })
    const showEditArea = computed(() => {
      const { isLogin, _id } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
    })
    const currentImageUrl = computed(() => {
      if (currentPost.value && currentPost.value.image) {
        const { image } = currentPost.value
        return image.url + '?x-oss-process=image/resize,w_850'
      } else {
        return null
      }
    })
    const hideAndDelete = () => {
      modalIsVisible.value = false
      store
        .dispatch('deletePost', currentId)
        .then((rawData: ResponseType<PostProps>) => {
          createMessage('删除成功！2秒后跳转到专栏首页', 'success')
          router.push(`/column/${rawData.data.column}`)
        })
    }
    return {
      modalIsVisible,
      currentPost,
      currentHTML,
      showEditArea,
      currentImageUrl,
      hideAndDelete
    }
  }
})
</script>
<style scoped>
</style>
