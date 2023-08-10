<template>
    <div class="logo-wrap">
        <Logo />
    </div>
    <div class="forgot-wrap flex  justify-center items-center w-100vw h-100vh">
        <a-form :model="formState" name="normal_login" class="forget-form" :rules="rules" @finish="onFinish"
            @finishFailed="onFinishFailed" layout="vertical" ref="formRef">
            <a-form-item label="" name="username">
                <a-input aria-placeholder="请输入手机号" placeholder="请输入手机号" v-model:value="formState.username">
                    <template #prefix>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g opacity="0.5">
                                <path
                                    d="M12.75 1.5H5.25C4.62868 1.5 4.125 2.00368 4.125 2.625V15.375C4.125 15.9963 4.62868 16.5 5.25 16.5H12.75C13.3713 16.5 13.875 15.9963 13.875 15.375V2.625C13.875 2.00368 13.3713 1.5 12.75 1.5Z"
                                    stroke="#2C261B" />
                                <path d="M8.25 3.75H9.75" stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7.5 14.25H10.5" stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item label="" name="password">
                <a-input-password placeholder="请输入密码" v-model:value="formState.password">
                    <template #prefix>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g opacity="0.5">
                                <path
                                    d="M15 8.25H3C2.58579 8.25 2.25 8.58579 2.25 9V15.75C2.25 16.1642 2.58579 16.5 3 16.5H15C15.4142 16.5 15.75 16.1642 15.75 15.75V9C15.75 8.58579 15.4142 8.25 15 8.25Z"
                                    stroke="#2C261B" stroke-linejoin="round" />
                                <path
                                    d="M5.25 8.25V5.25C5.25 3.17893 6.92895 1.5 9 1.5C11.071 1.5 12.75 3.17893 12.75 5.25V8.25"
                                    stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9 11.25V13.5" stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item label="" name="rePassword">
                <a-input-password placeholder="请再次输入密码" v-model:value="formState.rePassword">
                    <template #prefix>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g opacity="0.5">
                                <path
                                    d="M15 8.25H3C2.58579 8.25 2.25 8.58579 2.25 9V15.75C2.25 16.1642 2.58579 16.5 3 16.5H15C15.4142 16.5 15.75 16.1642 15.75 15.75V9C15.75 8.58579 15.4142 8.25 15 8.25Z"
                                    stroke="#2C261B" stroke-linejoin="round" />
                                <path
                                    d="M5.25 8.25V5.25C5.25 3.17893 6.92895 1.5 9 1.5C11.071 1.5 12.75 3.17893 12.75 5.25V8.25"
                                    stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9 11.25V13.5" stroke="#2C261B" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                        </svg>
                    </template>
                </a-input-password>
            </a-form-item>
            <a-form-item class="font-600 c-#2C261B" label="验证码选择" name="type" :rules="[
                { required: true, trigger: 'change', message: '请选择验证码方式' },
            ]">
                <a-radio-group v-model:value="formState.type">
                    <a-radio value="0">手机验证</a-radio>
                    <a-radio value="1">邮箱验证</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="" name="code">
                <div style="display: flex;">
                    <a-input placeholder="请输入验证码" v-model:value="formState.code">
                        <template #prefix>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
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

            <a-form-item class="action-wrap w-100 flex">
                <a-button class="return-btn mr-16px w-114px h-40px" @click="$router.push('/login')">
                    返回
                </a-button>
                <a-button class="confirm-btn h-40px w-270px" :disabled="loading" type="primary" html-type="submit">
                    确认修改
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
import Logo from "../components/logo.vue"

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
    type: "",
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
::v-deep .ant-input-affix-wrapper {
    min-height: 36px;
    height: 36px;
}

.logo-wrap {
    position: absolute;
    top: 18px;
    left: 32px;
}

.forget-form {
    width: 480px;
    height: 560px;
    flex-shrink: 0;
    border-radius: 6px;
    background: var(--unnamed, #FFF);
    box-shadow: 0px 0px 60px 0px rgba(44, 38, 27, 0.06);
    padding: 36px;
    position: relative;

    .return-btn {
        border-radius: 6px;
        border: 1px solid #EAE9E8;
    }

    .confirm-btn {
        border-radius: 6px;
        background: var(--unnamed, #2C261B);
    }
}

.action-wrap {
    position: absolute;
    bottom: 0px;
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
