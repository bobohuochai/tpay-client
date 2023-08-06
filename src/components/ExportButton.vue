<template>
  <a-button type="primary" @click="handle">导出</a-button>
  <!-- <Teleport to="#app">
    <a-modal v-model:visible="visible" title="验证" :footer="null">
      <div>
        <a-form
          ref="formRef"
          layout="inline"
          :style="{ marginBottom: '20px' }"
          :model="dto"
          :rules="rules"
        >
          <a-form-item name="payPassword" label="支付密码">
            <a-input
              placeholder="请输入支付密码"
              type="password"
              v-model:value="dto.payPassword"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="finish">提交</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </Teleport> -->
</template>
<script setup>
import { ref } from "vue";
import * as userCardApis from "../services/userCard";

const formRef = ref();
const visible = ref(false);
const dto = ref({
  payPassword: "",
});

const rules = {
  payPassword: [{ required: true, message: "请输入支付密码" }],
};

const emits = defineEmits({
  success: () => true,
});

const handle = async () => {
  // const data = await userCardApis.verifyPayPassword({});
  // visible.value = !data.flag;
  // if (data.flag) {
  //   emits("success");
  // }
  emits("success");
};

const finish = async () => {
  await formRef.value.validate();
  emits("success");
};
</script>
