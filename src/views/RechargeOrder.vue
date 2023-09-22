<template>
    <div class="page page-recharge-order">
        <a-card>
            <a-form name=" recharge-order-form" layout="horizontal" :model="formState" :labelCol="{
                span: 2,
            }" @finish="onFinish">
                <p class="label">充值金额</p>
                <a-radio-group 
                    v-model:value="formState.remittanceCurrency" 
                    class="mb-12px"
                    @change="handleChangeRemiittanceCurrency(formState.remittanceCurrency)"
                >
                    <a-radio v-for="option in remittanceCurrencyOption" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </a-radio>
                </a-radio-group>
                <a-form-item label="" name="remittanceAmount" :rules="[{ required: true, validator: checkRechargeAmount }]">
                    <a-input 
                        style="width: 286px" 
                        v-model:value="formState.remittanceAmount" :precision="2"
                        placeholder="请输入充值金额"
                    >
                        <template #suffix>
                            <span class="font-400 c-#2C261B text-opacity-70">{{ formState.remittanceCurrency }}</span>
                        </template>
                    </a-input>
                </a-form-item>
                <a-divider />

                <div class="wallet-wrap flex">
                    <div class="left mr-16px flex flex-col items-center">
                        <div class="h-8px w-8px border-rd-50 bg-#F9D796 mt-3px"></div>
                        <div class="w-border-left"></div>
                        <div class="h-8px w-8px border-rd-50 bg-#F9D796 mb-7px"></div>
                    </div>
                    <div class="right">
                        <p class="label">币种钱包</p>
                        <a-form-item label="" name="walletId" :rules="[{ required: true, message: '请选择钱包' }]">
                            <a-radio-group 
                                button-style="solid" 
                                v-model:value="formState.walletId"
                                class="wallet-group flex items-center"
                            >
                                <a-radio-button 
                                    v-for="item in userStore.userInfo.walletVos" 
                                    :key="item" 
                                    :value="item.id"
                                    class="wallet-item mr-16px"
                                    :disabled="item.currencyCode !== 'USD'"
                                >
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <img class="h-16px w-16px"
                                                :src="currencyFile(`/src/assets/currency/${item.currencyCode}.svg`)"
                                                alt="" />
                                            <span class="pl-4px">{{ item.currencyCode }}</span>
                                        </div>
                                        <div class="separator mx-16px"></div>
                                        <span>{{ amountDes(item.currencyCode, item.usableQuota) }}</span>
                                        <SelectedWalletImg class="selectd-img" v-if="formState.walletId === item.id" />
                                    </div>
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <div class="rate-item flex items-center"
                            v-if="selectedWallet && formState.remittanceCurrency !== selectedWallet.currencyCode">
                            <img style="border-radius: 6px;" class="h-16px w-16px"
                                :src="currencyFile('/src/assets/borderDollar.png')" />
                            <span class="text-12px font-400 c-#2C261B pl-18px">1.00 {{ formState.remittanceCurrency }} ≈ {{
                                onlineRate }}
                                {{
                                    selectedWallet.currencyCode
                                }}</span>
                            <span class="font-400 text-10px c-#2C261B text-opacity-40 pl-12px">更新于今天: {{ refreshDate }}</span>
                        </div>
                        <div class="mt-24px">
                            <label class="font-600">预计到账金额：</label>
                            <template v-if="selectedWallet">
                                <b>{{ previewAmount }} {{ selectedWallet.currencyCode }}</b>
                            </template>
                        </div>
                    </div>

                </div>
                <a-divider />
                <p class="label">汇款方式</p>
                <a-form-item label="" name="receiptChannel" :rules="[{ required: true, message: '请选择汇款方式' }]">
                    <a-radio-group @change="handleChangeChannel(formState.receiptChannel)"
                        v-model:value="formState.receiptChannel" button-style="solid" class="card-item">
                        <a-radio-button v-for="item in receiptChannels" :key="item.key" :value="item.value"
                            class="wallet-item mr-16px">
                            <div>
                                {{ `${item.value}` }}
                                <SelectedWalletImg class="selectd-img" v-if="formState.receiptChannel === item.value" />
                            </div>
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <p class="label">收款账户</p>
                <a-form-item label="" name="receiptAccountId" :rules="[{ required: true, message: '请选择收款账户' }]">
                    <a-select @change="handleChagneAccountId(formState.receiptAccountId)" style="width: 286px"
                        :options="receiptAccounts" v-model:value="formState.receiptAccountId" placeholder="请选择收款账户"
                        allowClear></a-select>
                    <a-button type="primary" class="ml-8px" @click="handleCopy(formState.receiptAccountId)">复制</a-button>
                    <div v-if="formState.receiptAccountId && accountData" class="account-wrapper">
                        <div class="item-list" v-if="accountData.accountName">
                            Account Name(银行开户名): <span> {{ accountData.accountName }}</span>
                        </div>
                        <div class="item-list" v-if="accountData.supportedCurrencies">
                            Supported Currencies:
                            <span> {{ accountData.supportedCurrencies }}</span>
                        </div>
                        <div class="item-list" v-if="accountData.bankName">
                            Bank Name: <span> {{ accountData.bankName }}</span>
                        </div>
                        <div class="item-list" v-if="accountData.bankAddress">
                            Bank Address(银行地址): <span> {{ accountData.bankAddress }}</span>
                        </div>
                        <div class="item-list" v-if="accountData.country">
                            Country/Region(国家/地区): <span> {{ accountData.country }}</span>
                        </div>
                        <div class="item-list" v-if="accountData.swiftCode">
                            SwiftCode/BIC(Swift代码): <span> {{ accountData.swiftCode }}</span>
                        </div>
                    </div>
                </a-form-item>
                <p class="label">充值凭证 <span class="pl-16px font-400"
                        style="color: rgba(44, 38, 27, 0.40); font-size: 10px">支持格式：JPG、JPEG、PNG &nbsp;
                        文件大小：≦10M</span>
                </p>
                <a-form-item label="" name="fileList" :rules="[{ required: true, message: '请选择凭证' }]">
                    <a-upload v-model:file-list="formState.fileList" name="fileList" list-type="picture-card"
                        :showUploadList="{ showPreviewIcon: false, showRemoveIcon: true }"
                        accept="image/png, image/jpeg, image/jpg" :maxCount="1" :customRequest="uploadFile">


                        <a-button type="dashed" class="upload-btn text-10px w-80px px-4px">
                            <upload-outlined></upload-outlined><span>上传凭证</span>
                        </a-button>


                    </a-upload>
                </a-form-item>

                <a-button class="submit-btn" html-type="submit">充值</a-button>

            </a-form>
        </a-card>
    </div>
</template>
<script setup>
import { computed, reactive, ref, watchEffect, onMounted } from "vue";
import { message } from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import * as rechargeLogApis from "../services/recharge-log";
import * as uploadApis from "../services/upload";
import * as receiptAccountApis from "../services/receiptAccount";
import { useUserStore } from "../stores/user";
import { useFile } from '../hooks/useFile'
import SelectedWalletImg from '../components/icons/selectedWallet.vue'

const amountDes = (currency, amount) => {
    switch (currency) {
        case 'USD':
            return `$ ${Number(amount).toLocaleString()}`
            break;
        case 'EUR':
            return `€ ${Number(amount).toLocaleString()}`
            break;
        case 'GBP':
            return `£ ${Number(amount).toLocaleString()}`
            break;
        default:
            break;
    }
}

const currencyFile = (imgFile) => {
    return useFile(imgFile)
}

const userStore = useUserStore();
const receiptChannels = ref([]);
const receiptAccounts = ref([]);
const remittanceCurrencyOption = [
    {
        label: "USD",
        value: "USD",
    },
    {
        label: "CNY",
        value: "CNY",
    },
    {
        label: "EUR",
        value: "EUR",
    },
    {
        label: "GBP",
        value: "GBP",
    },
];
const onlineRate = ref(0);
const refreshDate = ref('');

const formState = reactive({
    walletId: userStore.usdWallet.id, //钱包
    remittanceAmount: null, // 汇款金额
    remittanceCurrency: "USD", // 币种
    receiptChannel: "", // 汇款方式
    receiptAccountId: null, // 汇款账户
    fileList: [], // 凭证
});

const checkRechargeAmount = async (_rule, value) => {
  if (!value) {
    return Promise.reject("请输入金额");
  }
  if (!/^(0|[1-9][0-9]*)(\.\d+)?$/.test(value)) {
    return Promise.reject("金额格式不对");
  }
  if (formState.remittanceCurrency === 'CNY' && value < 500) {
    return Promise.reject("金额最小为 500");
  } else if (value < 0.01) {
    return Promise.reject("金额最小为 0.01");
  }
  return Promise.resolve();
};

const selectedWallet = computed(() => {
    const { walletId } = formState;
    if (
        walletId &&
        userStore.userInfo.walletVos &&
        userStore.userInfo.walletVos.length
    ) {
        const wa = userStore.userInfo.walletVos.find((w) => w.id === walletId);
        return wa;
    }
});

const uploadFile = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const res = await uploadApis.upload(formData);
        onSuccess(res);
    } catch (error) {
        onError(error);
    }
};

let accountData = ref({});

const handleChagneAccountId = (accountId) => {
    if (accountId) {
        let account = receiptAccounts.value.find((account) => {
            return account.value === accountId;
        });

        accountData.value = account.data;
    }
};

const handleCopy = function (accountId) {
    if (accountId) {
        let account = receiptAccounts.value.find((account) => {
            return account.value === accountId;
        });
        const textValue = document.createElement("textarea"); // 创建DOM元素
        document.body.appendChild(textValue); // 将创建的DOM插入到Body上
        textValue.value = account.label; // 将数据赋值给创建的DOM元素的Value上
        textValue.select(); // 通过表单元素的select()方法选中内容
        document.execCommand("copy"); // 执行浏览器复制命令
        document.body.removeChild(textValue); // 移除DOM元素
        message.success("复制成功");
    }
};

const handleChangeChannel = async (val) => {
    formState.receiptAccountId = null;
    const res = await receiptAccountApis.listAll({
        channel: val,
        status: 0
    });
    let accounts = [];
    if (res.length) {
        res.forEach((element) => {
            if (formState.receiptAccountId === undefined || formState.receiptAccountId === null) {
                formState.receiptAccountId = element.id;
                accountData.value = element;
            }
            accounts.push({
                label: element.account,
                value: element.id,
                data: element,
            });
        });
        receiptAccounts.value = accounts;
    }
};

const handleChangeRemiittanceCurrency = async(val) => {
    const channels = await receiptAccountApis.groupByChannel({
        currencyCode: formState.remittanceCurrency
    });
    receiptChannels.value = channels.map((it) => ({
        key: it,
        value: it,
    }));
    // 清空已选
    formState.receiptChannel = '';
    formState.receiptAccountId = null;
}

const onFinish = async (values) => {
    values.fileName = values.fileList[0]?.response;
    // 处理汇款币种的默认值
    if (values.remittanceCurrency === undefined || values.remittanceCurrency === '') {
        values.remittanceCurrency = formState.remittanceCurrency;
    }
    delete values.fileList;
    if (formState.walletId !== undefined) {
        formState.walletId = "";
        await rechargeLogApis.createOrder(values);
        message.success("已提交申请，待处理");
        window.location.href = window.location.origin + window.location.pathname + "#/recharge-list";
        formState.remittanceAmount = "";
        formState.remittanceCurrency = "USD";
        formState.remittanceType = "";
        formState.recevieAccount = "";
        formState.fileList = [];
    } else {
        message.warn("请勿重复提交");
    }
};

let previewAmount = ref(0);

watchEffect(async () => {
    if (
        formState.remittanceCurrency &&
        formState.walletId
    ) {
        const res = await rechargeLogApis.calcRechargeFee({
            sourceCode: formState.remittanceCurrency, // 汇款币种
            toCode: selectedWallet.value.currencyCode, // 币种钱包
            amount: formState.remittanceAmount === null ? 0 : formState.remittanceAmount,
        });
        previewAmount.value = formState.remittanceAmount === null ? 0 : res.realAmount;
        onlineRate.value = res.onlineRateReverse;
        refreshDate.value = res.refreshDate;
    } else {
        previewAmount.value = 0;
        onlineRate.value = 0;
        refreshDate.value = '';
    }
});

onMounted(async () => {
    handleChangeRemiittanceCurrency();
});
</script>

<style scoped lang="less">
.page-recharge-order {
    background-color: #f6f6f6;
    margin: -24px;
    color: #2C261B;
}

p.label {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
}

::v-deep .ant-picker,
::v-deep .ant-select:not(.ant-select-customize-input) .ant-select-selector,
::v-deep .ant-input {
    background: unset;

}

.wallet-item {
    border-radius: 6px;
    border: 1px solid #EAE9E8;
    background: #FFF;
    display: flex;
    padding: 7px 16px;
    align-items: center;
    height: 36px;
    display: inline-flex;

    .separator {
        border-left: 1px solid #EAE9E8;
        width: 1px;
        height: 22px;
    }

    .selectd-img {
        position: absolute;
        right: 0px;
        bottom: 0px;

    }
}

div.right {
    .rate-item {
        border-radius: 6px;
        background: rgba(249, 215, 150, 0.20);
        height: 24px;
        flex-shrink: 0;
        width: 300px;
        position: relative;
        left: -32px;
        bottom: 0px;

        img {
            background: rgba(249, 215, 150);
            margin-left: 4px;
        }
    }
}


.w-border-left {
    height: 100%;
    border-left: 2px solid #F9D796;
}

.upload-btn {
    border-radius: 6px;
    border: 1px dashed #F9D796;
    color: #F9D796;
}




::v-deep .ant-radio-button-wrapper-checked.wallet-item {
    border-radius: 6px;
    border: 1px solid #F65050;
    background: #FFF;
    border-right-color: #F65050 !important;
    color: #2C261B;
}

::v-deep .ant-radio-button-wrapper:not(:first-child)::before {
    display: none;
}

::v-deep .ant-select,
::v-deep .ant-input-affix-wrapper {
    height: 36px;
    line-height: 36px;
    border-radius: 6px;
    color: #2C261B
}

::v-deep .ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input {
    height: 36px;
}



.submit-btn {
    display: flex;
    width: 114px;
    height: 40px;
    padding: 13px 0px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 6px;
    background: #2C261B;
    color: #fff;
}

.select-item {
    margin-right: 20px;
}

.account-wrapper .item-list {
    margin: 5px 0;
}
</style>