<template>
  <div>
    <a-upload
      v-if="!post"
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="uploadFile"
    >
      <img
        v-if="url"
        :src="url"
        style="width: 104px; height: 104px; object-fit: cover"
        alt="value"
      />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">限制5M的jpg、png、jpeg</div>
      </div>
    </a-upload>
    <a-image v-if="url && post" :src="url" :alt="url" style="width: 104px" />
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import * as uploadApis from "../services/upload";
import { computedAsync } from "@vueuse/core";
import { message } from 'ant-design-vue';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  post: {
    type: Boolean,
  },
});

const emits = defineEmits({
  "update:value": (value) => true,
});

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

const uploadFile = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    loading.value = true;
    const res = await uploadApis.upload(formData);
    emits("update:value", res);
    onSuccess(res);
  } catch (error) {
    onError(error);
  } finally {
    loading.value = false;
  }
};
const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  if (!isJpgOrPng) {
    message.error("只能上传图片类型");
  }
  const isLt3M = file.size / 1024 / 1024 < 5;
  if (!isLt3M) {
    message.error("图片大小必须少于5MB");
  }
  return isJpgOrPng && isLt3M;
};


const loading = ref(false);

const fileList = ref([]);

const url = computedAsync(
  async () => {
    return props.value === "" || props.value === null
      ? ""
      : await uploadApis.generateTokenUrl({
          fileName: props.value,
        });
  },
  "" // initial state
);
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
