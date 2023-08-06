<template>
  <a-modal v-model:visible="visible" title="忘记密码" @ok="onFinish">
    <a-form :model="formState" ref="formRef">
      <a-form-item
        label="邮箱"
        :rules="[{ required: true, message: '请输入邮箱' }]"
      >
        <a-input v-model:value="formState.email" placeholder="请输入邮箱">
        </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref, reactive } from "vue";
import * as userApis from "../services/user";
import { message } from "ant-design-vue";

const formState = reactive({
  email: "",
  channel: "",
});
const formRef = ref();
const visible = ref(false);
const loading = ref(false);

defineExpose({
  show(channel = "unLoginForgot") {
    formState.email = "";
    formState.channel = channel;
    visible.value = true;
  },
});
const onFinish = async () => {
  await formRef.value.validate();
  loading.value = true;
  await userApis.sendEmail(formState);
  loading.value = false;
  message.success("邮件已发送，请通过邮件链接修改密码");
  visible.value = false;
};
</script>
