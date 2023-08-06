<template>
  <div>
    <a-upload
      v-if="!post"
      v-model:file-list="fileList"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :customRequest="uploadFile"
    >
      <div style="width:150px">
        <a-button style="display: block;width: 100%;">
          <loading-outlined v-if="loading"></loading-outlined>
          <template v-else>{{ url ? "重新上传" : "上传5M以下的pdf" }}</template>
        </a-button>
      </div>
    </a-upload>
    <a-anchor-link title="附件点击下载" :href="url" style="padding-left: 0;"/>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import * as uploadApis from "../services/upload";
import { computedAsync } from "@vueuse/core";
import { message } from "ant-design-vue";

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
  const isPdf = file.type === "application/pdf";
  if (!isPdf) {
    message.error("只能上传PDF类型");
  }
  const isLt3M = file.size / 1024 / 1024 < 5;
  if (!isLt3M) {
    message.error("图片大小必须少于5MB");
  }
  return isPdf && isLt3M;
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

<style lang="less" scoped></style>
