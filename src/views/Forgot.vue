<template>
  <div class="login">
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      :rules="rules"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      layout="vertical"
      ref="formRef"
    >
      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username"></a-input>
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item label="确认密码" name="rePassword">
        <a-input-password v-model:value="formState.rePassword">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        label="验证码选择"
        name="type"
        :rules="[
          { required: true, trigger: 'change',message: '请选择验证码方式'  },
        ]"
      >
        <div style="display: flex;">
          <a-select v-model:value="formState.type">
            <a-select-option value="0">手机验证</a-select-option>
            <a-select-option value="1">邮箱验证</a-select-option>
          </a-select>
          <a-button class="btn-send" @click="handleSendMessageCode()" :disabled="canSendCheck()">发送验证码</a-button>
          <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
        </div>
      </a-form-item>
      <a-form-item label="验证码" name="code">
        <a-input placeholder="输入验证码" v-model:value="formState.code"></a-input>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="loading"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          确认修改
        </a-button>
        <a-button
          class="login-form-button"
          @click="$router.push('/login')"
          style="margin-top: 16px"
        >
          返回
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LockOutlined } from "@ant-design/icons-vue";
import * as userApis from "../services/user";
import { message } from "ant-design-vue";
import { useSendMessage } from '../hooks/message-send.js';

let { canSendCount, isSending, canSendCheck, sendMessageCode } = useSendMessage(async () => {
  await userApis.sendAuthCodeForFree({
    type: formState.type,
    account: formState.username
  })
  message.success('发送成功')
});

const formRef = ref()
const handleSendMessageCode = async () => {
  const validate = await formRef.value.validateFields('type');
  sendMessageCode();
}

const formState = reactive({
  password: "",
  rePassword: "",
  type:"",
  code: ""
});

const rules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
  rePassword: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value !== formState.password) {
          callback("确认密码和密码必须一致");
          return;
        }
        callback();
      },
    },
  ],
  code: [{ required: true, message: "请输入验证码" }],
  type: [{ required: true, message: "请选择类型" }],
};
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const onFinish = async (values) => {
  loading.value = true;
  await userApis
    .emailUpdatePassword({
      ...formState
    })
    .finally(() => {
      loading.value = false;
    });
  message.success("修改成功，请登录");
  router.push("/login");
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

</script>
<style lang="less" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #f0f2f5 url(../assets/login-bg.svg) no-repeat 50%;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-form {
  width: 320px;
}
.login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
.btn-send {
  margin-left: 10px;
}
.send-message-count {
  padding: 0 5px;
  line-height: 32px;
  color: #958e8e;
}
</style>
