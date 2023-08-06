<template>
  <div class="page page-clear-list">
    <div class="form-wrapper">
      <a-form
        name="auth-list-form"
        layout="inline"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item label="卡号" name="cardNumber">
          <a-input
            v-model:value="formState.cardNumber"
            placeholder="请输入卡号"
          >
          </a-input>
        </a-form-item>
<!--        <a-form-item-->
<!--          v-if="userStore.userInfo.roleCode !== 'USER'"-->
<!--          label="邮箱"-->
<!--          name="targetUserId"-->
<!--        >-->
<!--          <EmailSelect v-model:value="formState.targetUserId" />-->
<!--        </a-form-item>-->
        <a-form-item label="类型" name="type">
          <a-select
            :options="typeEnum"
            v-model:value="formState.type"
            placeholder="类型"
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
      :data-source="clearPagingRes.records"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>
<script setup>
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { computed, onMounted, reactive, ref } from "vue";
import EmailSelect from "../components/EmailSelect.vue";
import { downloadFromRes } from "../helpers/utils";
import * as transApis from "../services/trans";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

const loading = ref(false);

const { listByEmail } = storeToRefs(userStore);

const formState = reactive({
  cardNumber: null,
  targetUserId: null,
  type: null,
  date: [dayjs().subtract(7, "day"), dayjs()],
});

const typeEnum = reactive([
  // 类型 Credit 贷记 Debit 借记
  {
    label: "贷记",
    value: "Credit",
  },
  {
    label: "借记",
    value: "Debit",
  },
]);

let clearPagingRes = ref({});

const pagination = computed(() => {
  return {
    total: Number(clearPagingRes.value.total),
    pageSize: Number(clearPagingRes.value.size),
    current: Number(clearPagingRes.value.current),
  };
});

const columns = reactive([
  {
    title: "时间",
    dataIndex: "postingDate",
  },
  {
    title: "卡号",
    dataIndex: "cardNumber",
  },
  {
    title: "交易类型",
    dataIndex: "type",
  },
  {
    title: "交易状态",
    dataIndex: "type",
  },
  {
    title: "交易金额",
    dataIndex: "billingAmount",
    customRender({ record }) {
      return `${record.billingAmount}${record.billingCurrency}`;
    },
  },
  {
    title: "交易费",
    dataIndex: "billingAmount",
    customRender({ record }) {
      return `${record.billingAmount}${record.billingCurrency}`;
    },
  },
  {
    title: "交易币种",
    dataIndex: "billingAmount",
    customRender({ record }) {
      return `${record.billingAmount}${record.billingCurrency}`;
    },
  },
  {
    title: "商户名称",
    dataIndex: "merchantName",
  },
  {
    title: "清算状态",
    dataIndex: "merchantName",
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
  const res = await transApis.deriveClearData(params);
  downloadFromRes(res);
};

const paging = async (params) => {
  loading.value = true;
  const res = await transApis.clearPaging(params);
  loading.value = false;
  clearPagingRes.value = res;
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
