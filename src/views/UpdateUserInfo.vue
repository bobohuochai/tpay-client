<template>
  <div class="page page-update-user-info">
    <h2>个人信息</h2>
    <a-card>
      <a-form
        ref="formRef"
        name="user-info-form"
        layout="horizontal"
        :labelCol="{ span: 2 }"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item
          label="手机号"
          name="phone"
          :rules="[{ required: true, message: '请输入手机号' }]"
        >
          <a-input
            v-model:value="formState.phone"
            placeholder="请输入新手机号"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ required: true, message: '请输入邮箱' }]"
        >
          <a-input
            v-model:value="formState.email"
            placeholder="请输入新邮箱"
          >
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
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import * as userApis from '../services/user';

const formRef = ref()
const formState = reactive({
  phone: null,
  email: null
});

const onFinish = async (values) => {
  await userApis.updateUserInfo(values);
  message.success('修改成功');
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
</style>
