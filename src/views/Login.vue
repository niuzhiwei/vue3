<template>
  <div class="login-page mx-auto p-3 w-330">
    <h5 class="my-4 text-center">登录到者也</h5>
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
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'Login',
  components: { ValidateInput, ValidateForm },
  setup () {
    const router = useRouter()
    const store = useStore()
    const emailVal = ref('111@test.com')
    const passwordVal = ref('111111')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    // 提交表单
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordVal.value,
          icode: 'A0AEFEEC4B540896'
        }
        store
          .dispatch('loginAndFetch', payload)
          .then(() => {
            createMessage('登录成功!2秒后跳转首页', 'success')
            setTimeout(() => {
              router.push('/')
            }, 2000)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
    return {
      emailRules,
      passwordRules,
      emailVal,
      passwordVal,
      onFormSubmit
    }
  }
})
</script>
<style  scoped>
</style>
