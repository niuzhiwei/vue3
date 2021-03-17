<template>
  <div class="update-userinfo mx-auto p-3 w-50">
    <div class="avatar d-flex align-items-center justify-content-between w-50">
      <label>头像:</label>
      <uploader
        action='/upload'
        class="bg-light text-secondary w-100 my-4"
        :beforeUpload='beforeUpload'
        @file-uploaded='onFileUploaded'
        :uploaded="uploadedData"
      >
        <h2>点击上传头像</h2>
        <template #loading>
          <div class="d-flex">
            <div
              class="spinner-border text-secondary"
              role="status"
            >
              <span class="visually-hidden">UPloading...</span>
            </div>
            <h2>正在上传</h2>
          </div>
        </template>
        <template #uploaded='dataProps'>
          <img :src="dataProps.uploadedData.data && dataProps.uploadedData.data.url">
        </template>
      </uploader>
    </div>
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
        <label class="form-label">个人简介</label>
        <validate-input
          tag='textarea'
          v-model="formData.description"
          placeholder='请输入个人简介'
          type='text'
        ></validate-input>
      </div>
      <template #submit>
        <button
          type="submit"
          class="btn btn-primary btn-block btn-lg w-100"
        >更新个人信息</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Uploader from '../components/Uploader.vue'
import createMessage from '../components/createMessage'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import { beforeUploadCheck } from '../helper'
import { ResponseType, ImageProps, UserProps } from '../testData'

export default defineComponent({
  components: { Uploader, ValidateForm, ValidateInput },
  setup () {
    const router = useRouter()
    const store = useStore()
    const formData = reactive(computed(() => store.state.user))
    const uploadedData = computed(() => {
      return { data: store.state.user.avatar }
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const nameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    let imageId = ''
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { _id } = store.state.user
        const { email, nickName, description } = formData.value
        const userInfo: UserProps = {
          email,
          nickName,
          description
        }
        if (imageId) {
          userInfo.avatar = imageId
        }
        const sendData = {
          id: _id,
          payload: { ...userInfo, icode: 'A0AEFEEC4B540896' }
        }
        store.dispatch('updateUser', sendData).then(() => {
          createMessage('更新个人信息成功！即将跳转到首页', 'success')
          router.push('/')
        })
      }
    }
    const beforeUpload = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 1Mb', 'error')
      }
      return passed
    }
    const onFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
        createMessage('图片上传成功！', 'success')
      }
    }
    return {
      emailRules,
      nameRules,
      beforeUpload,
      onFileUploaded,
      formData,
      uploadedData,
      onFormSubmit
    }
  }
})
</script>
<style>
.update-userinfo .file-upload-container img {
  height: 150px;
  width: 150px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 150px;
}
</style>
