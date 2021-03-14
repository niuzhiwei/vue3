<template>
  <div class="login-page mx-auto p-3 w-50">
    <validate-form @form-submit='onFormSubmit'>
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          v-model="formData.email"
          :rules="emailRules"
          placeholder='请输入邮箱地址'
          type='text'
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          v-model="formData.nickName"
          :rules="nameRules"
          placeholder='请输入昵称'
          type='text'
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          v-model="formData.password"
          :rules="passwordRules"
          placeholder='请输入密码'
          type='password'
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          v-model="formData.repeatPassword"
          :rules="repeatPasswordRules"
          placeholder='请再次输入密码'
          type='password'
        ></validate-input>
      </div>
      <template #submit>
        <button
          type="submit"
          class="btn btn-primary btn-block btn-lg w-100"
        >注册新用户</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  name: 'Login',
  components: { ValidateInput, ValidateForm },
  setup () {
    const router = useRouter()
    const store = useStore()
    const error = computed(() => store.state.error)
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]
    // 提交表单
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password,
          icode: 'A0AEFEEC4B540896'
        }
        axios
          .post('/users', payload)
          .then(() => {
            localStorage.removeItem('token')
            createMessage('注册成功!2秒后跳转到登录页面', 'success')
            setTimeout(() => {
              router.push('/login')
            }, 2000)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
    watch(
      () => error.value.status,
      () => {
        const { status, message } = error.value
        if (status && message) {
          createMessage(message, 'error')
        }
      }
    )

    return {
      formData,
      emailRules,
      nameRules,
      passwordRules,
      repeatPasswordRules,
      onFormSubmit
    }
  }
})
</script>
<style  scoped>
</style>
