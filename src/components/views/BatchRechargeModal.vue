<template>
  <a-modal
    v-model:visible="visible"
    title="批量充值"
    width="450px"
    :footer="null"
  >
    <template v-if="beforeBatch">
      <div>
        <p><span>操作介绍：确保账户余额充足</span></p>
        <p>1. 下载批量充值模板，按要求填写卡号和充值金额</p>
        <p>2. 上传批量充值文件</p>
      </div>
      <div class="buttom_botton_div">
        <a-button class="buttom_botton" type="white" @click="downloadTemplate">下载批量充值模板</a-button>
        <a-upload 
          v-model:file="file" 
          :show-upload-list="false"
          :before-upload="beforeUpload"
          :customRequest="uploadFile">
          <a-button type="primary">导入批量充值文件</a-button>
        </a-upload>
      </div>
    </template>
    <template v-if="!beforeBatch">
      <div class="content_div">
        <div>充值成功：   <span>{{ successCount }}</span> 张</div>
        <div>充值失败：   <span style="color: #F65050;">{{ errorCount }}</span> 张</div>
      </div>
      <div class="buttom_botton_div">
        <a-button type="primary" @click="downloadErrorFile">下载批量充值结果</a-button>
      </div>
    </template>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import * as userCardApis from "../../services/userCard";
import * as uploadApis from "../../services/upload";
import { downloadFromRes } from "../../helpers/utils";

const visible = ref(false);
const file = ref();
const beforeBatch = ref(true);
const errorCount = ref(0);
const errorFileName = ref();
const successCount = ref(0);

const downloadTemplate = async() => {
  const res = await userCardApis.rechargeBatchTemplate();
  downloadFromRes(res);
}

const downloadErrorFile = async() => {
  const res = await uploadApis.download({ fileName : errorFileName.value });
  downloadFromRes(res);
  emits("success");
  visible.value = false;
}

const beforeUpload = (file) => {
  const isExcel =
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    message.error("只能上传Excel");
  }
  return isExcel;
};

const uploadFile = async ({ file, onSuccess, onError }) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(formData);
  try {
    const res = await userCardApis.rechargeBatch(formData);
    console.log(res);
    if (res.errorCount === '0') {
      emits("success");
      onSuccess(res);
      visible.value = false;
    } else {
      beforeBatch.value = false;
      successCount.value = Number(res.successCount);
      errorCount.value = Number(res.errorCount);
      errorFileName.value = res.fileName;
    }
  } catch (error) {
    onError(error);
  } finally {
    // visible.value = false;
  }
};

const emits = defineEmits({
  success: () => true,
});
defineExpose({
  show() {
    visible.value = true;
    beforeBatch.value = true;
    successCount.value = 0;
    errorCount.value = 0;
    errorFileName.value = null;
  },
});

</script>

<style scoped>
.content_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3px;
}
.buttom_botton_div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 30px;
    padding-bottom: 10px;
}
.buttom_botton {
    margin-right: 20px;
}
</style>