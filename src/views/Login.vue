<template>
    <div class="flex">
        <div class="bg-box flex-shrink-0">
            <Logo class="logo" />
            <a-carousel :autoplay="true" effect="fade" dotPosition="left">
                <div class="bg-1">
                    <div class="text">
                        <p>值得信任的 <br />信用卡支付方案服务商</p>
                        <ul>
                            <li>香港MSO持牌，保证您的资金安全</li>
                            <li>满足您的电商采购、广告投放、游戏应用、SAAS等费用管理需求</li>
                            <li>提供香港美国欧洲等多个地区多个币种信用卡服务</li>
                        </ul>
                    </div>
                    <div class="img1"></div>
                </div>
                <div class="bg-2">
                    <div class="text">
                        <span>实用场景</span>
                        <div class="img2"></div>
                    </div>
                </div>
            </a-carousel>
        </div>
        <div class="login flex-grow-1">
            <p class="text-24px font-600 text-center mb-24px">登录</p>
            <a-form :model="formState" layout="vertical" name="normal_login" class="login-form" @finish="onFinish"
                @finishFailed="onFinishFailed" ref="formRef">
                <a-form-item label="" name="account" :rules="[{ required: true, message: '请输入手机号' }]">
                    <a-input v-model:value="formState.account" aria-placeholder="请输入手机号" placeholder="请输入手机号">
                        <template #prefix>

                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <g opacity="0.5">
                                    <path
                                        d="M12.75 1.5H5.25C4.62868 1.5 4.125 2.00368 4.125 2.625V15.375C4.125 15.9963 4.62868 16.5 5.25 16.5H12.75C13.3713 16.5 13.875 15.9963 13.875 15.375V2.625C13.875 2.00368 13.3713 1.5 12.75 1.5Z"
                                        stroke="#2C261B" />
                                    <path d="M8.25 3.75H9.75" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M7.5 14.25H10.5" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </g>
                            </svg>
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item class="password-box" label="" name="password" :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input-password v-model:value="formState.password" aria-placeholder="请输入密码" placeholder="请输入密码">
                        <template #prefix>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <g opacity="0.5">
                                    <path
                                        d="M15 8.25H3C2.58579 8.25 2.25 8.58579 2.25 9V15.75C2.25 16.1642 2.58579 16.5 3 16.5H15C15.4142 16.5 15.75 16.1642 15.75 15.75V9C15.75 8.58579 15.4142 8.25 15 8.25Z"
                                        stroke="#2C261B" stroke-linejoin="round" />
                                    <path
                                        d="M5.25 8.25V5.25C5.25 3.17893 6.92895 1.5 9 1.5C11.071 1.5 12.75 3.17893 12.75 5.25V8.25"
                                        stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9 11.25V13.5" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </g>
                            </svg>
                        </template>
                    </a-input-password>
                    <router-link class="login-form-forgot mt-12px" to="/forgot">忘记密码</router-link>
                </a-form-item>
                <a-form-item class="auth-code-type pt-12px mb-12px" label="验证码选择" name="authCodeType" :rules="[
                    { required: true, trigger: 'change', message: '请选择验证码方式' },
                ]">

                    <a-radio-group v-model:value="formState.authCodeType">
                        <a-radio value="0">手机验证</a-radio>
                        <a-radio value="1">邮箱验证</a-radio>
                    </a-radio-group>

                </a-form-item>
                <a-form-item label="" name="authCode">
                    <div class="flex">
                        <a-input class="h-36px" placeholder="输入验证码" v-model:value="formState.authCode">
                            <template #prefix>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                    fill="none">
                                    <g opacity="0.5">
                                        <path
                                            d="M2.25 3.47087L9.00323 1.5L15.75 3.47087V7.51264C15.75 11.7608 13.0313 15.5323 9.00097 16.8752C4.96954 15.5323 2.25 11.76 2.25 7.51076V3.47087Z"
                                            stroke="#333333" stroke-linejoin="round" />
                                        <path d="M5.625 8.625L8.25 11.25L12.75 6.75" stroke="#333333" stroke-linecap="round"
                                            stroke-linejoin="round" />
                                    </g>
                                </svg>
                            </template>
                        </a-input>
                        <a-button ghost type="primary" class="btn-send h-36px ml-12px" @click="handleSendMessageCode()"
                            :disabled="canSendCheck()">发送验证码</a-button>
                        <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
                    </div>
                </a-form-item>

                <a-form-item class="login-form-wrap">
                    <a-button html-type="submit" class="login-btn w-408px bg-#2C261B h-40px text-#fff">
                        登录
                    </a-button>
                </a-form-item>
            </a-form>
            <div class="text-center mt-24px">
                还没有账户，<router-link to="/register">去注册</router-link>
            </div>
            <div class="text-center mt-24px" style="margin-top: 100px;">
                <a href="/agreement.html" style="color: #807e7a;">用户协议与隐私保护</a>
                <!-- <a style="color: #807e7a;margin-left: 30px">隐私保护</a> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import * as userApis from "../services/user";
import { useSendMessage } from '../hooks/message-send.js';
import Logo from '../components/logo.vue';


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

const route = useRoute();
console.log(route);
const formState = reactive({
    account: "",
    password: "",
    remember: true,
    authCodeType: '0',
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
div.bg-1,
div.bg-2 {
    position: relative;
    height: 100vh;
    min-height: 960px;


}

div.bg-2 {
    div.text {
        position: absolute;
        right: calc(118px + 48px);
        top: 115px;
        box-sizing: border-box;
        padding-bottom: 55px;
    }

    span {
        color: #2C261B;
        font-size: 40px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -1.6px;
        padding-bottom: 35px;
        display: inline-block;
    }

    div.img2 {
        background: url('../assets/login2.png');
        background-size: cover;
        width: 465px;
        height: 493px;
    }
}

div.bg-1 {
    div.text {
        position: absolute;
        right: 203px;
        top: 115px;
        box-sizing: border-box;
        padding-bottom: 55px;
    }

    p {
        color: #2C261B;
        font-size: 48px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: -1.92px;
        width: 463px;
        margin-block: 0px;
        padding-bottom: 35px;
    }

    ul {
        margin-block: 0px;
        padding-inline-start: 16px;
    }

    ul li {
        color: #000000b3;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

    ul li:not(:last-child) {
        margin-bottom: 8px;
    }
}

div.img1 {
    background: url('../assets/login1.png');
    background-size: cover;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 838px;
    height: 468px;
}

.left {
    background: linear-gradient(333deg, #F9D796 0%, rgba(249, 215, 150, 0.43) 100%);
    box-shadow: 0px 0px 60px 0px rgba(249, 215, 150, 0.30);
    height: 100vh
}

.bg-box {
    border-radius: 6px 0px 0px 6px;
    background: linear-gradient(333deg, #F9D796 0%, rgba(249, 215, 150, 0.43) 100%);
    box-shadow: 0px 0px 60px 0px rgba(249, 215, 150, 0.30);
    height: 100vh;
    width: 58%;
    min-height: 960px;
}

.logo {
    position: absolute;
    top: 30px;
    left: 30px;
}

h4 {
    font-size: 40px;
    line-height: 55px;
    text-align: center;
}

.password-box {
    position: relative;
}


.login {
    position: absolute;
    top: 132px;
    left: calc(58% - 118px);
}

.login-form {
    border-radius: 6px;
    background: #fff;
    box-shadow: 0px 0px 60px 0px rgba(44, 38, 27, 0.06);
    width: 480px;
    height: 400px;
    flex-shrink: 0;
    padding: 36px;
    position: relative;
}

.login-form-forgot {
    float: right;
    position: absolute;
    display: block;
    right: 2px;
}

.login-form-wrap {
    width: 100%;
    position: absolute;
    bottom: 0px;
}



::v-deep .ant-input-affix-wrapper {
    min-height: 36px;
    height: 36px;
}

.auth-code-type {
    ::v-deep label {
        font-weight: 600
    }
}

.login-btn:hover {
    background-color: #2C261B;
    color: #fff;
}

.send-message-count {
    padding: 0 5px;
    line-height: 36px;
    color: #958e8e;
}
</style>
