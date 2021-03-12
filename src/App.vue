<template>
  <div class="container">
    <global-header :user='user'></global-header>
    <validate-form @form-submit='onFormSubmit'>
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          v-model="emailVal"
          :rules="emailRules"
          placeholder='请输入邮箱地址'
          type='text'
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          v-model="passwordVal"
          :rules="passwordRules"
          placeholder='请输入密码'
          type='password'
        ></validate-input>
      </div>
      <template #submit>
        <span class="btn btn-danger">Submit</span>
      </template>
    </validate-form>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateForm from './components/ValidateForm.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'

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
  components: { ColumnList, GlobalHeader, ValidateInput, ValidateForm },
  setup () {
    const emailVal = ref('123@163.com')
    const passwordVal = ref('123')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      console.log(result)
    }
    return {
      list: testData,
      user: currentUser,
      emailRules,
      passwordRules,
      emailVal,
      passwordVal,
      onFormSubmit
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
