<template>
  <div class="page page-update-pay-password">
    <h2>修改支付密码</h2>
    <div class="pay-password-setting">
      <span class="pay-password-setting__label">支付密码开关: </span>
      <a-switch
        v-model:checked="isOpen"
        checked-children="打开"
        un-checked-children="关闭"
        @change="handleChangePaySetting"
      />
    <br />
    </div>
    <a-card>
      <a-form
        ref="formRef"
        name="pay-password-form"
        layout="horizontal"
        :labelCol="{
          span: 2
        }"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item
          label="原密码"
          name="sourcePayPassword"
          :rules="[{ required: true, message: '请输入原密码' }]"
        >
          <a-input
            v-model:value="formState.sourcePayPassword"
            placeholder="请输入原密码"
            type="password"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="密码"
          name="payPassword"
          :rules="[
            { required: true, validator: validatePass, trigger: 'change' }, 
          ]"
        >
          <a-input
            v-model:value="formState.payPassword"
            placeholder="请输入密码"
            type="password"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="确认密码"
          name="payPassword2"
          :rules="[
            { required: true, validator: validatePass2, trigger: 'change'  },
          ]"
        >
          <a-input
            v-model:value="formState.payPassword2"
            placeholder="请输入密码"
            type="password"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="验证码选择"
          name="authCodeType"
          :rules="[
            { required: true, trigger: 'change',message: '请选择验证码方式'  },
          ]"
        >
          <div style="display: flex;">
            <a-select v-model:value="formState.authCodeType" :allow-clear="true">
              <a-select-option value="0">手机验证</a-select-option>
              <a-select-option value="1">邮箱验证</a-select-option>
            </a-select>
            <a-button class="btn-send" @click="handleSendMessageCode()" :disabled="canSendCheck()">发送验证码</a-button>
            <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
          </div>
        </a-form-item>
        <a-form-item
          label="验证码"
          name="authCode"
          :rules="[
            { required: true, trigger: 'change',message: '请输入验证码'  },
          ]"
        >
          <a-input
            placeholder="输入验证码"
            v-model:value="formState.authCode"
          ></a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 22, offset: 2 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script setup>
import { ref, computed, defineComponent, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import * as userApis from '../services/user';
import { useSendMessage } from '../hooks/message-send.js';
import { useUserStore } from '../stores/user';

let { canSendCount, isSending, canSendCheck, sendMessageCode } = useSendMessage(async () => {
  await userApis.sendAuthCode({
    type: formState.authCodeType
  })
  message.success('发送成功');
});


const userStore = useUserStore();
const isOpenRaw = parseInt(userStore.isOpen, 10) === 1
const isOpen = ref(isOpenRaw);

const handleChangePaySetting = async (val) => {
  try {
    await userApis.payPasswordSwitch({
      payPasswordSwitch: val
    })
    message.success('更新支付设置成功');
    userStore.updateOpen(val === true ? 1 : 0);
  } catch(e) {
    isOpen.value = !val;
  }
}

const handleSendMessageCode = async () => {
  const validate = await formRef.value.validateFields('authCodeType');
  sendMessageCode();
}

const formRef = ref()
let formState = reactive({
  sourcePayPassword: null,
  payPassword: null,
  payPassword2: null,
  authCodeType: '',
  authCode: ''
});


const validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    if (formState.payPassword2 !== '') {
      formRef.value.validateFields('payPassword2');
    }
    return Promise.resolve();
  }
};

const validatePass2 = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请再次输入密码')
  } else if (value !== formState.payPassword) {
    return Promise.reject('两次输入密码不一致!')
  } else {
    return Promise.resolve()
  }
}

const onFinish = async (values) => {
  let res = await userApis.updatePayPassword(values);
  formState = {
    sourcePayPassword: null,
    payPassword: null,
    payPassword2: null,
    authCodeType: '',
    authCode: ''
  }
  message.success('修改密码成功');
}
</script>
<style lang="less" scoped>
.scroll {
  width: 100%;
  height: 30px;
  overflow: hidden;
  .item {
    line-height: 30px;
    font-size: 18px;
    font-weight: 700
  }
}
.btn-send {
  margin-left: 10px;
}
.send-message-count {
  padding: 0 5px;
  line-height: 32px;
  color: #958e8e;
}
.pay-password-setting {
  margin: 10px 0 25px;
}
.pay-password-setting__label {
  margin-right: 15px;
}
</style>
