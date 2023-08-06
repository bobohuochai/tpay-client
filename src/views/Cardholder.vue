<template>
  <div class="page page-card-request">
    <div class="form-wrapper">
      <a-form
        name="card-list-form"
        layout="inline"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item label="持卡人姓" name="firstName">
          <a-input
            v-model:value="formState.firstName"
            placeholder="请输入持卡人姓"
          >
          </a-input>
        </a-form-item>
        <!-- <a-form-item label="持卡人名" name="lastName">
          <a-input
            v-model:value="formState.lastName"
            placeholder="请输入持卡人名"
          >
          </a-input>
        </a-form-item> -->
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
        <a-form-item>
          <ExportButton @success="onExportBtn"></ExportButton>
        </a-form-item>
      </a-form>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end">
        <a-button type="primary" @click="addRef.show()">添加</a-button>
      </div>
    </div>

    <a-table
      bordered
      :columns="columns"
      :data-source="pagingRes.records"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <a-space v-if="column.key === 'action'">
          <a @click="updateStatus(record)">
            {{ record.status === 0 ? "禁用" : "启用" }}
          </a>
          <a @click="addRef.show(record)">
            修改
          </a>
          <a @click="addRef.show(record,true)">
            查看
          </a>
        </a-space>
      </template>
    </a-table>
    <AddCardholderModal
      ref="addRef"
      @success="refreshCurrentPage"
    ></AddCardholderModal>
  </div>
</template>
<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { message, Modal, Button } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { downloadFromRes, checkAmount } from "../helpers/utils";
import EmailSelect from "../components/EmailSelect.vue";
import ExportButton from "../components/ExportButton.vue";
import AddCardholderModal from "../components//views/AddCardholderModal.vue";
import * as userApis from "../services/user";
import * as userCardApis from "../services/userCard";
import * as cardholderApis from "../services/cardholder";
import { useUserStore } from "../stores/user";

const loading = ref(false);
const addRef = ref();
const formState = reactive({
  firstName: null,
  lastName: null,
});

const pagingRes = ref({});

const pagination = computed(() => {
  return {
    total: Number(pagingRes.value.total),
    pageSize: Number(pagingRes.value.size),
    current: Number(pagingRes.value.current),
  };
});

const columns = reactive([
  {
    title: "持卡人名称",
    customRender: ({ record }) => {
      return `${record.firstName} ${record.lastName}`;
    },
  },
  {
    title: "手机号",
    dataIndex: "phone",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  { title: "操作", key: "action" },
]);

const onExportBtn = async () => {
  const res = await cardholderApis.derive(formState);
  downloadFromRes(res);
};

const paging = async (params) => {
  loading.value = true;
  const res = await cardholderApis.paging(params);
  loading.value = false;
  pagingRes.value = res;
};

const paramsBuilder = () => {
  const params = {
    ...formState,
  };
  delete params.date;

  return params;
};

const onFinish = async (values) => {
  const params = paramsBuilder();
  await paging(params);
};

const handleTableChange = async (pag) => {
  const params = paramsBuilder();
  params.current = pag.current;
  params.size = pag.pageSize;
  await paging(params);
};

const refreshCurrentPage = async () => {
  const params = paramsBuilder();
  params.current = pagination.value.current;
  params.size = pagination.value.pageSize;
  await paging(params);
};

const updateStatus = async (row) => {
  await cardholderApis.updateStatus({
    id: row.id,
    status: row.status === 0 ? 1 : 0,
  });
  message.success(row.status === 0 ? "已禁用" : "已启用");
  refreshCurrentPage();
  blockModalConfig.show = false;
};

onMounted(() => onFinish());
</script>
<style lang="less" scoped>
.scroll {
  width: 100%;
  height: 30px;
  overflow: hidden;
  .item {
    line-height: 30px;
    font-size: 18px;
    font-weight: 700;
  }
}
</style>
