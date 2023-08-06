<template>
  <a-modal
    v-model:visible="visible"
    :title="view ? '查看持卡人' : dto.id ? '修改持卡人' : '添加持卡人'"
    :footer="view ? null : undefined"
    @ok="save"
    width="700px"
  >
    <a-form ref="formRef" :model="dto" :rules="rules" v-bind="formItemLayout">
      <a-form-item label="姓" name="firstName">
        <a-input v-model:value="dto.firstName" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="名" name="lastName">
        <a-input v-model:value="dto.lastName" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="国家" name="country">
        <a-input v-model:value="dto.country" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="地区（省）" name="province">
        <a-input v-model:value="dto.province" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="市" name="city">
        <a-input v-model:value="dto.city" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="区" name="area">
        <a-input v-model:value="dto.area" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="邮编" name="postCode">
        <a-input v-model:value="dto.postCode" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="手机号" name="phone">
        <a-input v-model:value="dto.phone" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="dto.email" :disabled="view"> </a-input>
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="dto.remark" :disabled="view"> </a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import { ref } from "vue";
import * as cardholderApis from "../../services/cardholder";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
class Dto {
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.country = "";
    this.province = "";
    this.city = "";
    this.area = "";
    this.postCode = "";
    this.address = "";
    this.phone = "";
    this.email = "";
    this.remark = "";
  }
}

const visible = ref(false);
const loading = ref(false);
const view = ref(false);
const dto = ref(new Dto());


const checkEmail = (rule, value) => {

if (!value) {
  return Promise.reject("请输入邮箱");
}

const regexp = /[a-zA-Z0-9]+([-_.][A-Za-zd]+)*@([a-zA-Z0-9]+[-.])+[A-Za-zd]{2,5}$/;
if (!regexp.test(value)) {
  return Promise.reject("请输出正确的邮箱格式");
}

return Promise.resolve();
}

const rules = {
  firstName: [{ required: true, message: "请输入姓" }],
  lastName: [{ required: true, message: "请输入名" }],
  country: [{ required: true, message: "请输入国家三字代码" }],
  province: [{ required: true, message: "请输入省份" }],
  city: [{ required: true, message: "请输入城市" }],
  area: [{ required: true, message: "请输入区域" }],
  postCode: [{ required: true, message: "请输入邮编" }],
  address: [{ required: true, message: "请输入详细地址" }],
  phone: [{ required: true, message: "请输入联系电话" }],
  email: [{ required: true, validator: checkEmail }],
};
const formRef = ref();

const emits = defineEmits({
  success: () => true,
});
defineExpose({
  show(row, v = false) {
    formRef.value?.clearValidate();
    if (row) {
      dto.value = row;
    } else {
      dto.value = new Dto();
    }
    view.value = v;
    visible.value = true;
  },
});

const add = async () => {
  const result = await cardholderApis.createCardholder(dto.value);
  window.$utils?.checkResult(result, `添加成功`);
};

const update = async () => {
  const result = await cardholderApis.updateCardholder(dto.value);
  window.$utils?.checkResult(result, `修改成功`);
};

const save = async () => {
  await formRef.value.validate();
  loading.value = true;
  if (dto.value.id) await update();
  else await add();
  loading.value = false;
  emits("success");
  visible.value = false;
};
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 10px;
}
</style>