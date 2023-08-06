<template>
  <a-select
    v-model:value="value"
    show-search
    allowClear
    placeholder="请输入邮箱"
    style="width: 250px"
    :default-active-first-option="false"
    :show-arrow="false"
    :filter-option="false"
    :not-found-content="null"
    :options="data"
    @search="handleSearch"
    @change="change"
  >
  </a-select>
</template>
<script setup>
import { ref } from "vue";
import * as userApis from "../services/user";

const data = ref([]);
const value = ref();
const emits = defineEmits({
  change: (value) => true,
});
const handleSearch = async (val) => {
  const res = await userApis.listByEmail({
    email: val,
  });
  data.value = res.map((it) => ({
    value: it.id,
    label: `${it.account}(${it.email})`,
  }));
};

const change = (value) => {
  emits("change", value);
};
</script>
