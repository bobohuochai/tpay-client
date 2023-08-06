<template>
  <div class="page page-comptrol-list">
    <div class="form-wrapper">
      <a-form
        name="comptrol-list-form"
        layout="inline"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item label="类型" name="useFlag">
          <a-select
            :options="useFlagEnum"
            v-model:value="formState.useFlag"
            placeholder="类型"
            :style="{ width: '140px' }"
            allowClear
          >
          </a-select>
        </a-form-item>
        <a-form-item label="日期" name="date">
          <a-range-picker v-model:value="formState.date" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="onExportBtn">导出</a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      bordered
      :columns="columns"
      :data-source="comptrolPagingRes.records"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>
<script setup>
import dayjs from "dayjs";
import { computed, onMounted, reactive, ref } from "vue";
import { downloadFromRes } from "../helpers/utils";
import * as comptrolApis from "../services/comptrol";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const loading = ref(false);

const formState = reactive({
  useFlag: null,
  date: [dayjs().subtract(30, "day"), dayjs()],
});

const useFlagEnum = reactive([
  // 0 注册 1 登录 2 禁用 3 启用 4 注销 5 修改密码 6 修改支付密码
  {
    label: "注册",
    value: 0,
  },
  {
    label: "登录",
    value: 1,
  },
  {
    label: "禁用",
    value: 2,
  },
  {
    label: "启用",
    value: 3,
  },
  {
    label: "注销",
    value: 4,
  },
  {
    label: "修改密码",
    value: 5,
  },
  {
    label: "修改支付密码",
    value: 6,
  },
]);

let comptrolPagingRes = ref({});

const pagination = computed(() => {
  return {
    total: Number(comptrolPagingRes.value.total),
    pageSize: Number(comptrolPagingRes.value.size),
    current: Number(comptrolPagingRes.value.current),
  };
});

const columns = reactive([
  {
    title: "操作时间",
    dataIndex: "requestDate",
  },
  {
    title: "操作人",
    dataIndex: "operationUserAccount",
  },
  {
    title: "ip",
    dataIndex: "requestIp",
  },
  {
    title: "地区",
    dataIndex: "address",
    customRender({ record }) {
      return `${record.country}-${record.region}-${record.city}`;
    },
  },
  {
    title: "操作",
    dataIndex: "useFlag",
    customRender({ text }) {
      const u = useFlagEnum.find((u) => u.value === text);
      return u?.label;
    },
  },
]);

const onExportBtn = async () => {
  const params = {
    ...formState,
    startDate:
      formState.date && formState.date[0]
        ? dayjs(formState.date[0]).format("YYYY-MM-DD")
        : null,
    endDate:
      formState.date && formState.date[1]
        ? dayjs(formState.date[1]).format("YYYY-MM-DD")
        : null,
  };
  delete params.date;
  const res = await comptrolApis.derive(params);
  downloadFromRes(res);
};

const paging = async (params) => {
  loading.value = true;
  const res = await comptrolApis.paging(params);
  loading.value = false;
  comptrolPagingRes.value = res;
};

const paramsBuilder = () => {
  const params = {
    ...formState,
    startDate:
      formState.date && formState.date[0]
        ? dayjs(formState.date[0]).format("YYYY-MM-DD")
        : null,
    endDate:
      formState.date && formState.date[1]
        ? dayjs(formState.date[1]).format("YYYY-MM-DD")
        : null,
  };
  delete params.date;

  return params;
};

const onFinish = async () => {
  const params = paramsBuilder();
  await paging(params);
};

const handleTableChange = async (pag) => {
  const params = paramsBuilder();
  params.current = pag.current;
  params.size = pag.pageSize;
  await paging(params);
};

onMounted(async () => {
  onFinish();
});
</script>
<style lang="less" scoped></style>
