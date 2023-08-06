<template>
    <div class="login-wrap">
        <div class="bg-box">
            <div class="top">
                <div class="logo-container">
                    TPay
                </div>
                <p class="bolder title">
                    连接全球数字经济
                </p>
                <p class="bold text sub-title">
                    全球支付服务解决方案
                </p>
                <p class="text desc">
                    为您提供一站式的支付服务解决方案， 帮助您在世界范围内拓展业务以及更好的开拓新市场。
                </p>
            </div>
        </div>
        <div class="login">
            <h4>登录</h4>
            <p>欢迎来到TPay</p>
            <a-form :model="formState" layout="vertical" name="normal_login" class="login-form" @finish="onFinish"
                @finishFailed="onFinishFailed" ref="formRef">
                <a-form-item label="手机号" name="account" :rules="[{ required: true, message: '请输入手机号' }]">
                    <a-input v-model:value="formState.account">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item class="password-box" label="密码" name="password"
                    :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password">
                        <template #prefix>
                            <LockOutlined class="site-form-item-icon" />
                        </template>
                    </a-input-password>
                    <router-link class="login-form-forgot" to="/forgot">忘记密码</router-link>
                </a-form-item>
                <a-form-item label="验证码选择" name="authCodeType" :rules="[
                    { required: true, trigger: 'change', message: '请选择验证码方式' },
                ]">
                    <div style="display: flex;">
                        <a-select v-model:value="formState.authCodeType">
                            <a-select-option value="0">手机验证</a-select-option>
                            <a-select-option value="1">邮箱验证</a-select-option>
                        </a-select>
                        <a-button class="btn-send" @click="handleSendMessageCode()"
                            :disabled="canSendCheck()">发送验证码</a-button>
                        <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
                    </div>
                </a-form-item>
                <a-form-item label="验证码" name="authCode">
                    <a-input placeholder="输入验证码" v-model:value="formState.authCode"></a-input>
                </a-form-item>

                <a-form-item>
                    <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
                        登录
                    </a-button>
                    <div style="margin-top: 16px">
                        <router-link to="/register">还没有账户，去注册</router-link>
                    </div>
                </a-form-item>
            </a-form>
            <SendEmailVue ref="sendEmailVueRef"></SendEmailVue>
        </div>
    </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import * as userApis from "../services/user";
import SendEmailVue from "../components/SendEmail.vue";
import { useSendMessage } from '../hooks/message-send.js';


let { canSendCount, isSending, canSendCheck, sendMessageCode } = useSendMessage(async () => {
    await userApis.sendAuthCodeForFree({
        type: formState.authCodeType,
        phone: formState.account
    })
    message.success('发送成功')
});

const formRef = ref()
const handleSendMessageCode = async () => {
    const validate = await formRef.value.validateFields('authCodeType');
    sendMessageCode();
}

const sendEmailVueRef = ref();
const route = useRoute();
console.log(route);
const formState = reactive({
    account: "",
    password: "",
    remember: true,
    authCodeType: '',
    authCode: ''
});
const onFinish = async (values) => {
    await userApis.login(values);
    if (route.query.from) {
        window.location.href = decodeURIComponent(route.query.from);
    } else {
        window.location.href =
            window.location.origin + window.location.pathname + "#/home";
    }
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
const disabled = computed(() => {
    return !(formState.account && formState.password);
});
</script>
<style lang="less" scoped>
h4 {
    font-size: 40px;
    line-height: 55px;
    text-align: center;
}

.password-box {
    position: relative;
}

.login-wrap {
    display: flex;
}

.bg-box {
    position: relative;
    width: 40vw;
    height: 100vh;
    background: #f0f2f5 url(../assets/login-bg.svg) no-repeat 50%;
    background-size: 100%;
}

.login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1
}

.login-form {

    width: 320px;
}

.login-form-forgot {
    float: right;
    position: absolute;
    display: block;
    right: 2px;
    bottom: 38px;
}

.login-form-button {
    width: 100%;
    background: #ffd362;
    border-color: unset;
}

.bg-box {
    div.top {
        padding: 60px 90px 22px 87px;
        width: 80%;
    }

    div.logo-container {
        font-weight: 800;
        font-size: 32px;
    }

    .title {
        font-size: 26px;
        line-height: 43px;
        margin-bottom: 14px
    }

    .bolder {
        font-weight: 800;
    }

    .sub-title {
        font-size: 14px;
        line-height: 30px;
        margin-bottom: 10px;
    }

    .bold {
        font-weight: 600
    }

    .desc {
        font-size: 14px;
        line-height: 22px;
    }
}
</style>
