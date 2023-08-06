<template>
    <div class="page page-wallet-detail-list">
        <div class="form-wrapper">
            <a-form name="wallet-detail-list-form" layout="inline" :model="formState" @finish="onFinish">
                <a-form-item label="卡号" name="cardNumber">
                    <a-input v-model:value="formState.cardNumber" placeholder="请输入卡号">
                    </a-input>
                </a-form-item>
                <a-form-item label="类型" name="useFlag" :style="{ width: '200px' }">
                    <a-select :options="useFlagEnum" v-model:value="formState.useFlag" placeholder="类型" allowClear>
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
        <a-table bordered :columns="columns" :data-source="walletDetailPagingRes.records" :pagination="pagination"
            :loading="loading" @change="handleTableChange">
        </a-table>
    </div>
</template>
<script setup>
import { computed, defineComponent, reactive, ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { downloadFromRes } from "../helpers/utils";
import EmailSelect from "../components/EmailSelect.vue";
import * as walletDetailApis from "../services/wallet-detail";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
const loading = ref(false);

const { listByEmail } = storeToRefs(userStore);

const formState = reactive({
    cardNumber: null,
    targetUserId: null,
    useFlag: null,
    date: [dayjs().subtract(7, "day"), dayjs()],
});

const useFlagEnum = reactive([
    {
        label: '开卡手续费',
        value: 0
    },
    {
        label: "卡充值",
        value: 1,
    },
    {
        label: "卡余额转出",
        value: 2,
    },
    {
        label: "账户充值",
        value: 3,
    },
    {
        label: "销卡退回",
        value: 5,
    },
    {
        label: "账户调账",
        value: 16,
    },
    {
        label: '卡调账',
        value: 20
    },
    {
        label: "共享卡交易（授权）",
        value: 21,
    },
    {
        label: "共享卡交易（撤销）",
        value: 22,
    },
    {
        label: "共享卡交易（退款）",
        value: 23,
    },
    {
        label: '交易手续费',
        value: 30
    },
    {
        label: '退款手续费',
        value: 31
    },
    {
        label: '撤销手续费',
        value: 32
    },
    {
        label: '交易失败手续费',
        value: 33
    },
    {
        label: '小额交易费',
        value: 34
    },
    {
        label: '跨境手续费',
        value: 35
    },
    {
        label: '货币转化费',
        value: 36
    }
]);

const statusEnum = reactive([
    {
        label: '成功',
        value: 0
    },
    {
        label: '失败',
        value: 1
    },
    {
        label: '处理中',
        value: 2
    },
]);

let walletDetailPagingRes = ref({});

const pagination = computed(() => {
    return {
        total: Number(walletDetailPagingRes.value.total),
        pageSize: Number(walletDetailPagingRes.value.size),
        current: Number(walletDetailPagingRes.value.current),
    };
});

const columns = reactive([
    {
        title: "时间",
        dataIndex: "requestDate",
    },
    {
        title: "订单ID",
        dataIndex: "orderId",
    },
    {
        title: "卡号",
        dataIndex: "cardNumber",
    },
    {
        title: "类型",
        dataIndex: "useFlag",
        customRender({ text }) {
            const u = useFlagEnum.find((f) => f.value === text);
            return u?.label || "";
        },
    },
    // {
    //     title: "状态",
    //     dataIndex: "status",
    //     customRender({ text }) {
    //         const u = statusEnum.find((f) => f.value === text);
    //         return u?.label || "";
    //     },
    // },
    {
        title: "交易金额",
        dataIndex: "amount",
        customRender({ record }) {
            return `${record.amount}${record.currencyCode}`;
        },
    },
    {
        title: "账户余额",
        dataIndex: "walletAmount",
        customRender({ record }) {
            return `${record.walletAmount}${record.currencyCode}`;
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
    const res = await walletDetailApis.derive(params);
    downloadFromRes(res);
};

const paging = async (params) => {
    loading.value = true;
    const res = await walletDetailApis.paging(params);
    loading.value = false;
    walletDetailPagingRes.value = res;
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
