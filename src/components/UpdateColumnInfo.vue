<template>
  <div class="update-column mx-auto p-3 w-50">
    <uploader
      action='/upload'
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      :beforeUpload='beforeUpload'
      @file-uploaded='onFileUploaded'
      :uploaded="uploadedData"
    >
      <h2>点击上传专栏封面</h2>
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
    <validate-form @form-submit='onFormSubmit'>
      <div class="mb-3">
        <label class="form-label">专栏名称</label>
        <validate-input
          v-model="formData.title"
          :rules="titleRules"
          placeholder='请输入专栏名称'
          type='text'
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">专栏简介</label>
        <validate-input
          tag='textarea'
          v-model="formData.description"
          placeholder='请输入专栏简介'
          type='text'
        ></validate-input>
      </div>
      <template #submit>
        <button
          type="submit"
          class="btn btn-primary btn-block btn-lg w-100"
        >更新专栏信息</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Uploader from '../components/Uploader.vue'
import createMessage from '../components/createMessage'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import { beforeUploadCheck } from '../helper'
import { ResponseType, ImageProps, ColumnProps } from '../testData'

export default defineComponent({
  components: { Uploader, ValidateForm, ValidateInput },
  setup () {
    const router = useRouter()
    const store = useStore()
    const formData = reactive({ title: '', description: '' })
    const uploadedData = reactive({ data: {} })
    const { column } = store.state.user
    const titleRules: RulesProp = [
      { type: 'required', message: '专栏名称不能为空' }
    ]
    onMounted(() => {
      store.dispatch('fetchColumn', column).then((res) => {
        const { title, description, avatar } = res.data
        formData.title = title
        formData.description = description
        uploadedData.data = avatar
      })
    })
    let imageId = ''
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const columnInfo: ColumnProps = formData
        if (imageId) {
          columnInfo.avatar = imageId
        }
        const sendData = {
          id: column,
          payload: { ...columnInfo, icode: 'A0AEFEEC4B540896' }
        }
        store.dispatch('updateColonm', sendData).then(() => {
          createMessage('更新专栏信息成功！即将跳转到个人专栏', 'success')
          router.push({ name: 'column', params: { id: column } })
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
      titleRules,
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
.update-column .file-upload-container {
  height: auto;
  cursor: pointer;
  overflow: hidden;
}
.update-column .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.uploaded-area {
  position: relative;
}
.uploaded-area:hover h3 {
  display: block;
}
.uploaded-area h3 {
  display: none;
  position: absolute;
  color: #999;
  text-align: center;
  width: 100%;
  top: 50%;
}
</style>
