<template>
  <div>
    <ul
      class="nav nav-tabs"
      id="myTab"
      role="tablist"
    >
      <li
        v-for="tab in tabs"
        :key="tab.index"
        class="nav-item"
        :role="tab.index"
        @click="activeTabs = tab"
      >
        <button
          :class="{'active':activeTabs.index === tab.index}"
          class="nav-link"
          type="button"
          :role="tab.index"
        >{{tab.name}}</button>
      </li>
    </ul>
    <div
      class="tab-content"
      id="myTabContent"
    >
      <div
        v-for="tab in tabs"
        :key='tab.index'
        :class="{'active':activeTabs.index === tab.index}"
        class="tab-pane"
        :id="tab.index"
        role="tabpanel"
      >
        <component :is="tab.component"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, defineComponent, ref } from 'vue'
import UpdateUserInfo from '../components/UpdateUserInfo.vue'
import UpdateColumnInfo from '../components/UpdateColumnInfo.vue'
interface TabItem {
  index: string;
  name: string;
  component: Component;
}

export default defineComponent({
  component: { UpdateUserInfo, UpdateColumnInfo },
  setup () {
    const tabs: Array<TabItem> = [
      { index: 'userinfo', name: '个人资料', component: UpdateUserInfo },
      { index: 'columninfo', name: '专栏简介', component: UpdateColumnInfo }
    ]
    const activeTabs = ref({ index: 'userinfo', name: '个人资料' })
    return {
      tabs,
      activeTabs
    }
  }
})
</script>
<style scoped>
</style>
