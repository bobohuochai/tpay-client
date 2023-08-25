<template>
    <div class="page page-clear-list">

        <a-form class="mb-24px" name="auth-list-form" layout="inline" :model="formState" @finish="onFinish">
            <a-form-item label="卡号" name="cardNumber">
                <a-input v-model:value="formState.cardNumber" placeholder="请输入卡号">
                </a-input>
            </a-form-item>
            <a-form-item label="类型" name="type" class="w-200px">
                <a-select :options="typeEnum" v-model:value="formState.type" placeholder="请选择" allowClear>
                </a-select>
            </a-form-item>
            <a-form-item label="日期" name="date">
                <a-range-picker v-model:value="formState.date" />
            </a-form-item>
            <a-form-item>
                <a-button html-type="submit" class="search-btn">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                </a-button>
            </a-form-item>



            <a-form-item class="right">
                <a-button type="primary" @click="onExportBtn" class="c-#2C261B font-400 text-opacity-70">
                    <template #icon>
                        <ExportOutlined />
                    </template>
                    导出
                </a-button>
            </a-form-item>
        </a-form>

        <a-table bordered class="transaction-detail" :columns="columns" :data-source="clearPagingRes.records"
            :loading="loading" :pagination="pagination" @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <a-space v-if="column.dataIndex === 'operate'">
                    <a @click="showDetailModal(record)">查看详情</a>
                </a-space>
            </template>
            <template #emptyText>
                <div class="flex flex-col justify-center items-center pa-32px">
                    <EmptyIcon />
                    <span>还没有数据，请开卡交易</span>
                </div>
            </template>
        </a-table>

        <a-modal v-model:visible="visible" title="交易详情" @ok="handleOk" @cancel="handleOk">
            <div class="charge-fee-container">
                <ul class="charge-fee-wrapper">
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title"
                            style="font-weight: 700;margin-bottom: 5px;">交易信息:</span></li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易日期:</span> {{
                        transData.tranDate }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易流水号:</span> {{
                        transData.tranId }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">卡号:</span> {{
                        transData.cardNumber }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">卡类型:</span> {{
                        transData.isShare === true ? '共享卡' : '充值卡' }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">卡组织:</span> {{
                        transData.cardType }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易类型:</span> {{
                        TansTypes[transData.authType] }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易金额:</span> {{
                        `${transData.billingAmount} ${transData.billingCurrency}` }}</li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">订单金额:</span> {{
                        `${transData.merchantAmount} ${transData.merchantCurrency}` }}</li>
                    <!-- <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">总手续费:</span> {{
                        transData.fee }}</li> -->
                </ul>
                <ul class="charge-fee-wrapper">
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title"
                            style="font-weight: 700;margin-bottom: 5px;">资金信息:</span></li>
                    <li v-if="transData.feeDetail?.transactionFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">交易手续费:</span>{{ transData.feeDetail?.transactionFee }}
                    </li>
                    <li v-if="transData.feeDetail?.crossBorderTransactionFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">跨境手续费:</span>{{
                                transData.feeDetail?.crossBorderTransactionFee }}</li>
                    <li v-if="transData.feeDetail?.failedFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">失败交易手续费:</span>{{ transData.feeDetail?.failedFee }}</li>
                    <li v-if="transData.feeDetail?.conversionFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">网关手续费:</span>{{ transData.feeDetail?.conversionFee }}
                    </li>
                    <li v-if="transData.feeDetail?.discardFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">撤销手续费:</span>{{ transData.feeDetail?.discardFee }}</li>
                    <li v-if="transData.feeDetail?.refundFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">退款手续费:</span>{{ transData.feeDetail?.refundFee }}</li>
                    <li v-if="transData.feeDetail?.smallTransactionFee" class="charge-fee-wrapper__item"><span
                            class="charge-fee-wrapper__item-title">小额交易手续费:</span>{{
                                transData.feeDetail?.smallTransactionFee }}</li>
                </ul>
                <ul class="charge-fee-wrapper">
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title"
                            style="font-weight: 700;margin-bottom: 5px;">others:</span></li>
                    <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">商户名称:</span> {{
                        transData.merchantName }}</li>
                    <!-- <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">验证码:</span>{{ transData.mcc }}</li> -->
                </ul>
            </div>
        </a-modal>
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
import { SearchOutlined, ExportOutlined } from '@ant-design/icons-vue';
import EmptyIcon from '../components/icons/empty.vue'

const userStore = useUserStore();

const loading = ref(false);

const { listByEmail } = storeToRefs(userStore);

let visible = ref(false);
let transData = ref({});

const formState = reactive({
    cardNumber: null,
    targetUserId: null,
    type: null,
    date: [dayjs().subtract(7, "day"), dayjs()],
});

const TansTypes = {
    'Auth': '授权交易',
    'Purchase Return': '交易退款',
    'Reversal': '授权撤销'
}

const typeEnum = reactive([
    // 类型 Credit 贷记 Debit 借记
    {
        label: "授权",
        value: "Auth",
    },
    {
        label: "撤销",
        value: "Reversal",
    },
    {
        label: "退款",
        value: "Purchase Return",
    }
]);

const showDetailModal = async (record) => {
    visible.value = true;
    const res = await transApis.transDetail({ authId: record.id });
    console.log(res);
    transData.value = res;
}

const handleOk = () => {
    visible.value = false;
}

let clearPagingRes = ref({});

const pagination = computed(() => {
    return {
        total: Number(clearPagingRes.value.total),
        pageSize: Number(clearPagingRes.value.size),
        current: Number(clearPagingRes.value.current),
        showQuickJumper: true
    };
});

const columns = reactive([
    {
        title: "时间",
        width: 150,
        dataIndex: "tranDate",
    },
    {
        title: "卡号",
        width: 150,
        dataIndex: "cardNumber",
    },
    {
        title: "交易类型",
        width: 90,
        dataIndex: "authType",
        customRender({ text }) {
            const map = {
                'Auth': '授权',
                'Reversal': '撤销',
                'Purchase Return': '退款'
            }
            return map[text]
        },
    },
    {
        title: "交易状态",
        width: 90,
        dataIndex: "status",
        customRender({ text }) {
            const map = {
                'DECLINED': '失败',
                'APPROVED': '成功'
            }

            return map[text]
        },
    },
    {
        title: "失败原因",
        dataIndex: "failReason",
    },
    {
        title: "平台交易金额",
        dataIndex: "merchantAmount",
        customRender({ record }) {
            return `${record.merchantAmount} ${record.merchantCurrency}`
        },
    },
    {
        title: "卡交易金额",
        dataIndex: "billingAmount",
        customRender({ record }) {
            return `${record.billingAmount} ${record.billingCurrency}`
        },
    },
    {
        title: "手续费",
        dataIndex: "fee",
        customRender({ record }) {
            return `${record.fee} ${record.billingCurrency}`
        },
    },
    {
        title: "商户名称",
        dataIndex: "merchantName",
    },
    // {
    //     title: "清算状态",
    //     width: 90,
    //     dataIndex: "status",
    //     customRender({ text }) {
    //         const map = {
    //             'DECLINED': '清算失败',
    //             'APPROVED': '清算成功'
    //         }
    //         return map[text]
    //     }
    // },
    {
        title: "操作",
        width: 90,
        dataIndex: "operate",
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



<style scoped lang="less">
.charge-fee-wrapper {
    margin: 0;
    padding: 0;
}

.charge-fee-wrapper__item {
    display: flex;
}

.charge-fee-wrapper__item-title {
    width: 120px;
    margin-right: 25px;
    text-align: right;
}

.right {
    position: absolute;
    right: 36px
}

.transaction-detail {
    ::v-deep table thead tr th {
        border-bottom: 1px solid rgba(221, 177, 99, 0.00);
        background: rgba(221, 177, 99, 0.08);
    }
}

::v-deep .ant-picker,
::v-deep .ant-select:not(.ant-select-customize-input) .ant-select-selector,
::v-deep .ant-input {
    border-radius: 6px;
}

.search-btn {
    border-radius: 6px;
}
</style>