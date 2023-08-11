<template>
    <div class="register-wrap flex  ">
        <div class="bg-box w-838px flex-shrink-0">
            <div class="itm"><img class="h-960px w-838px" src="../assets/register.png" /></div>
        </div>
        <div class="register flex-grow-1">
            <p class="text-24px font-600 text-center mb-24px c-#2C261B">注册账号</p>
            <a-form :model="formState" name="normal_login" class="register-form" :rules="rules" layout="vertical"
                @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="" name="account">
                    <div style="display: flex;">
                        <a-input aria-placeholder="请输入手机号" placeholder="请输入手机号" v-model:value="formState.account">
                            <template #prefix>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                    fill="none">
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
                        <!-- <a-button class="btn-send" @click="handleSendMessageCode()"
                            :disabled="canSendCheck()">发送验证码</a-button>
                        <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span> -->
                    </div>
                </a-form-item>
                <!-- <a-form-item label="验证码" name="authCode">
                    <a-input v-model:value="formState.authCode">
                    </a-input>
                </a-form-item> -->
                <!-- 
                <a-form-item label="用户名" name="username">
                    <a-input v-model:value="formState.username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item> -->

                <a-form-item label="" name="password">
                    <a-input-password aria-placeholder="请输入密码" placeholder="请输入密码" v-model:value="formState.password">
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
                </a-form-item>
                <a-form-item label="" name="rePassword">
                    <a-input-password aria-placeholder="请再次输入密码" placeholder="请再次输入密码" v-model:value="formState.rePassword">
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
                </a-form-item>

                <a-form-item label="" name="email">
                    <a-input aria-placeholder="请输入邮箱账号" placeholder="请输入邮箱账号" v-model:value="formState.email">
                        <template #prefix>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <g opacity="0.5">
                                    <path d="M1.5 14.625H16.5V9V3.375H9H1.5V9V14.625Z" stroke="#2C261B"
                                        stroke-linejoin="round" />
                                    <path d="M1.5 3.375L9 9L16.5 3.375" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M9 3.375H1.5V9" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M16.5 9V3.375H9" stroke="#2C261B" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </g>
                            </svg>
                        </template>
                    </a-input>
                </a-form-item>
                <div class="flex ">
                    <div class="w-56px mr-12px mt-6px">主体类型</div>
                    <a-form-item class="flex-grow-1" label="" name="kycType">
                        <a-select v-model:value="formState.kycType" :options="kycTypeOptions">
                        </a-select>
                    </a-form-item>
                </div>
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
                <a-form-item v-if="showReferralCode" label="" name="referralCode">
                    <a-input aria-placeholder="请输入推荐码" placeholder="请输入推荐码" v-model:value="formState.referralCode">
                        <template #suffix>
                            <div class="color-#2C261B"> （非必填）</div>
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item class="register-btn-wrap">
                    <a-button :disabled="loading" type="primary" html-type="submit"
                        class="register-button w-408px bg-#2C261B h-40px text-#fff">
                        注册
                    </a-button>
                </a-form-item>
            </a-form>
            <div class="text-center mt-24px">
                已有账号，<router-link to="/login">去登录</router-link>
            </div>
        </div>
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
    authCode: "",
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
.register {
    position: absolute;
    top: 152px;
    bottom: 162px;
    left: 720px;
}

.register-form {
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 0px 60px 0px rgba(44, 38, 27, 0.06);
    width: 480px;
    height: 560px;
    flex-shrink: 0;
    padding: 36px;
    position: relative;
}


.register-button:hover {
    background-color: #2C261B;
    color: #fff;
}

.register-btn-wrap {
    position: absolute;
    bottom: 0px;
}

.btn-send {
    margin-left: 10px;
}

.send-message-count {
    padding: 0 5px;
    line-height: 36px;
    color: #958e8e;
}

::v-deep .ant-input-affix-wrapper {
    min-height: 36px;
    height: 36px;
}

::v-deep .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 36px;
    line-height: 36px;
}
</style>
