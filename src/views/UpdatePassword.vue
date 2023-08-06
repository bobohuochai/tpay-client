<template>
    <div class="page page-update-password">
        <h2>修改密码</h2>
        <a-card>
            <a-form ref="formRef" name="password-form" layout="horizontal" :labelCol="{
                span: 2
            }" :model="formState" @finish="onFinish">
                <a-form-item label="原密码" name="sourcePassword" :rules="[{ required: true, message: '请输入原密码' }]">
                    <a-input v-model:value="formState.sourcePassword" placeholder="请输入原密码" type="password">
                    </a-input>
                </a-form-item>
                <a-form-item label="密码" name="password" :rules="[
                    { required: true, validator: validatePass, trigger: 'change' },
                ]">
                    <a-input v-model:value="formState.password" placeholder="请输入密码" type="password">
                    </a-input>
                </a-form-item>
                <a-form-item label="确认密码" name="password2" :rules="[
                    { required: true, validator: validatePass2, trigger: 'change' },
                ]">
                    <a-input v-model:value="formState.password2" placeholder="请输入密码" type="password">
                    </a-input>
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

const formRef = ref()
const formState = reactive({
    sourcePassword: null,
    password: null,
    password2: null,
});

const validatePass = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入密码');
    } else {
        if (!formState.password2) {
            formRef.value.validateFields('password2');
        }
        return Promise.resolve();
    }
};

const validatePass2 = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请再次输入密码')
    } else if (value !== formState.password) {
        return Promise.reject('两次输入密码不一致!')
    } else {
        return Promise.resolve()
    }
}

const onFinish = async (values) => {
    await userApis.updatePassword(values);
    message.success('修改密码成功');
}

</script>
<style lang="less" scoped></style>
