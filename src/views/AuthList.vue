<template>
    <div class="page page-auth-list">
        <div class="form-wrapper">
            <a-form name="auth-list-form" layout="inline" :model="formState" @finish="onFinish">
                <a-form-item label="卡号" name="cardNumber">
                    <a-input v-model:value="formState.cardNumber" placeholder="请输入卡号">
                    </a-input>
                </a-form-item>
                <!--        <a-form-item-->
                <!--          v-if="userStore.userInfo.roleCode !== 'USER'"-->
                <!--          label="邮箱"-->
                <!--          name="targetUserId"-->
                <!--        >-->
                <!--          <EmailSelect v-model:value="formState.targetUserId" />-->
                <!--        </a-form-item>-->
                <a-form-item label="状态" name="status" :style="{ width: '140px' }">
                    <a-select :options="cardStatusEnum" v-model:value="formState.status" placeholder="状态" allowClear>
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
        <a-table bordered :columns="columns" :data-source="authPagingRes.records" :pagination="pagination"
            :loading="loading" @change="handleTableChange">
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
    status: null,
    date: [dayjs().subtract(30, "day"), dayjs()],
});

const cardStatusEnum = reactive([
    // 状态 APPROVED 授权成功 DECLINED 授权失败
    {
        label: "成功",
        value: "APPROVED",
    },
    {
        label: "失败",
        value: "DECLINED",
    },
]);

let authPagingRes = ref({});

const pagination = computed(() => {
    return {
        total: Number(authPagingRes.value.total),
        pageSize: Number(authPagingRes.value.size),
        current: Number(authPagingRes.value.current),
    };
});

const columns = reactive([
    {
        title: "记录日期",
        dataIndex: "tranDate",
    },
    {
        title: "商户名",
        dataIndex: "merchantName",
    },
    {
        title: "卡号",
        dataIndex: "cardNumber",
    },
    {
        title: "类型",
        dataIndex: "authType",
    },
    {
        title: "商户金额",
        dataIndex: "merchantAmount",
        customRender({ record }) {
            return `${record.merchantAmount}${record.merchantCurrency}`;
        },
    },
    {
        title: "账单金额",
        dataIndex: "billingAmount",
        customRender({ record }) {
            return `${record.billingAmount}${record.billingCurrency}`;
        },
    },
    {
        title: "记录编号",
        dataIndex: "tranId",
    },
    {
        title: "状态",
        dataIndex: "status",
        customRender({ text }) {
            const u = cardStatusEnum.find((f) => f.value === text);
            return u?.label || "";
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
    const res = await transApis.deriveAuthData(params);
    downloadFromRes(res);
};



const paging = async (params) => {
    loading.value = true;
    const res = await transApis.authPaging(params);
    loading.value = false;
    authPagingRes.value = res;
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
