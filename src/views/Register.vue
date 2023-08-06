<template>
  <div class="login">
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      :rules="rules"
      layout="vertical"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item label="手机号" name="account">
        <div style="display: flex;">
          <a-input v-model:value="formState.account">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
          <a-button class="btn-send" @click="handleSendMessageCode()" :disabled="canSendCheck()">发送验证码</a-button>
          <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
        </div>
      </a-form-item>
      <a-form-item label="验证码" name="authCode">
        <a-input v-model:value="formState.authCode">
        </a-input>
      </a-form-item>

      <a-form-item label="用户名" name="username">
        <a-input v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
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

      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="formState.email">
          <template #prefix>
            <MailOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="主体类型" name="kycType">
        <a-select v-model:value="formState.kycType" :options="kycTypeOptions">
          <template #prefix>
            <BankOutlined class="site-form-item-icon" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item v-if="showReferralCode" label="推荐码(非必填)" name="referralCode">
        <a-input v-model:value="formState.referralCode">
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          :disabled="loading"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          注册
        </a-button>

        <a-button
          class="login-form-button"
          @click="$router.push('/login')"
          style="margin-top: 16px"
        >
          返回
        </a-button>
        <!-- Or
        <a href="">还没有账户，去注册</a> -->
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as userApis from "../services/user";
import { message } from "ant-design-vue";
import { useSendMessage } from '../hooks/message-send.js';

const formState = reactive({
  account: "",
  username: "",
  password: "",
  rePassword: "",
  email: "",
  kycType: 1,
  authCode:"", 
  authCodeType: 0,
  referralCode: "",
});
const showReferralCode = ref(true);

let { canSendCount, isSending, canSendCheck, sendMessageCode } = useSendMessage(async () => {
  await userApis.sendAuthCodeForFree({
    phone: formState.account,
    type: '0'
  })
  message.success('发送成功');
});

const handleSendMessageCode = async () => {
  sendMessageCode();
}

const rules = {
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
  rePassword: [
    {
      validator: (rule, value, callback) => {
        if (value !== formState.password) {
          callback("确认密码和密码必须一致");
          return;
        }
        callback();
      },
    },
  ],
  email: [{ required: true, message: "请输入邮箱" }],
  account: [{ required: true, message: "请输入手机号" }],
  kycType: [{ required: true, message: "请输入主体类型" }],
  authCode: [{ required: true, message: "请输入验证码" }]
};
const loading = ref(false);
const kycTypeOptions = [
  {
    value: 1,
    label: "大陆个人",
  },
  {
    value: 2,
    label: "大陆企业",
  },
  {
    value: 3,
    label: "香港企业",
  },
];

const { currentRoute } = useRouter();
const route = currentRoute.value;

onMounted(() => {
  if (route.params.referralCode !== undefined) {
    formState.referralCode = route.params.referralCode;
    showReferralCode.value = false;
  }
});

const onFinish = async () => {
  loading.value = true;
  await userApis.externalRegister(formState).finally(() => {
    loading.value = false;
  });
  message.success("注册成功，请登录");
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
  width: 400px;
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
