<template>
    <div class="wrap-box">
        <div class="page page-card-request">
            <p class="label">卡片类型</p>
            <!-- 申请卡 -->
            <div v-show="openCardStep === 'openCard'">
                <a-form ref="openCardFormRef" name="card-request-form" layout="horizontal" :labelCol="{
                    span: 2,
                }" :model="formState" @finish="onFinish">
                    <a-form-item label="" name="isShare" :rules="[{ required: true, message: '请选择卡片类型' }]"
                        @change="handleChangeCardType(formState.isShare)">
                        <a-radio-group v-model:value="formState.isShare">
                            <a-radio-button :value="false" class="radio-item no-share-radio-button mr-16px">
                                <SelectedWalletImg class="selectd-img" v-if="!formState.isShare" />
                            </a-radio-button>
                            <!-- 共享卡 -->
                            <!-- <a-radio-button :value="true" class="share-radio-button">
                                <SelectedWalletImg class="selectd-img" v-if="formState.isShare" />
                            </a-radio-button>  -->
                        </a-radio-group>
                    </a-form-item>
                    <p class="label">卡Bin</p>
                    <a-form-item label="" name="cardId" :rules="[{ required: true, message: '请选择卡Bin' }]">
                        <a-radio-group v-model:value="formState.cardId" button-style="solid">
                            <a-radio-button class="radio-item card-bin-btn mr-16px" v-for="item in sectionNoList"
                                :key="item.id" :value="item.id">
                                <div class="flex flex-col">
                                    <div class="region-label  h-36px flex items-center justify-between px-8px">
                                        <div class="flex items-center">
                                            <img class="h-16px w-16px"
                                                :src="currencyFile(`/src/assets/currency/${item.currency}.svg`)" alt="" />
                                            <span
                                                class="pl-4px c-#2C261B text-opacity-50 font-400 text-12px leading-none">{{
                                                    item.currencyName }}</span>
                                        </div>
                                        <img class="w-32px" :src="currencyFile(`/src/assets/cards/${item.cardLabel}.png`)"
                                            alt="" />
                                    </div>
                                    <div class="bin-text bg-#2c261b0a h-36px flex items-center justify-center">
                                        <span class="c-#2C261B font-500 text-16px leading-none ">{{ item.sectionNo }}</span>
                                    </div>
                                    <SelectedWalletImg class="selectd-img" v-if="formState.cardId === item.id" />
                                </div>
                            </a-radio-button>
                        </a-radio-group>
                    </a-form-item>
                    <p class="label">开卡数量</p>
                    <a-form-item class="w-320px" label="" name="count" :rules="[
                        { required: true, validator: checkCount, trigger: 'change' },
                    ]">
                        <a-input class="count-input" v-model:value="formState.count" placeholder="请输入开卡数量" type="number">
                        </a-input>
                    </a-form-item>
                    <p class="label">持卡人</p>
                    <a-form-item class="w-320px" label="" name="cardholderId"
                        :rules="[{ required: true, message: '请选择持卡人' }]">
                        <a-select class="cardholder-select" :options="cardholder" v-model:value="formState.cardholderId"
                            placeholder="请选择持卡人" allowClear></a-select>
                    </a-form-item>
                    <!--  合并步骤 -->
                    <p class="label">选择账户</p>
                    <a-form-item label="" name="wallet" :rules="[{ required: true, message: '请选择余额账户' }]">
                        <a-radio-group button-style="solid" v-model:value="formState.wallet" @change="handeChangeCurrency"
                            class="wallet-group flex items-center">
                            <a-radio-button 
                                v-for=" item in userStore.userInfo.walletVos" 
                                :key="item" 
                                :value="item.id"
                                :disabled="item.currencyCode !== 'USD'"
                                class="wallet-item-btn radio-item mr-16px"
                            >
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <img class="h-16px w-16px"
                                            :src="currencyFile(`/src/assets/currency/${item.currencyCode}.svg`)" alt="" />
                                        <span class="pl-4px font-400 text-12px leading-none c-#2C261B">{{ item.currencyCode
                                        }}</span>
                                    </div>
                                    <div class="separator mx-16px"></div>
                                    <span>{{ amountDes(item.currencyCode, item.usableQuota) }}</span>
                                    <SelectedWalletImg class="selectd-img" v-if="formState.wallet === item.id" />
                                </div>
                            </a-radio-button>
                        </a-radio-group>

                    </a-form-item>
                    <!-- 合并步骤-->
                    <p class="label">单卡充值金额</p>
                    <a-form-item class="w-320px" label="" name="amount"
                        :rules="[{ required: true, validator: checkAmount }]">
                        <a-input class="amount-input" placeholder="请输入充值金额" v-model:value="formState.amount" type="number"
                            @change="handleChargeChange(formState.amount)">
                            <template #suffix>
                                <span>{{ currencyCode }}</span>
                            </template>
                        </a-input>
                    </a-form-item>
                    <!-- 合并步骤-->
                    <p class="label">单卡到账金额</p>
                    <a-form-item class="w-320px" label="" name="charge">
                        <a-input class="amount-input" placeholder="请输入到账金额" v-model:value="formState.charge"
                            :disabled="true">
                            <template #suffix>
                                <span>{{ currencyCode }}</span>
                            </template>
                        </a-input>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <!-- 新增-->
        <div class="result" v-if="formValid">
            <p class="c-#2C261B text-20px leading-none font-400 mb-16px mt-24px">付款确认</p>
            <div class="pay_comfirm_wrapper">
                <div class="mb-24px"><span class="label">总手续费</span> <span>{{ formState.sumApplyFee }} {{ currencyCode
                }}</span>
                </div>
                <div class="mb-24px"><span class="label">卡到账金额</span> <span>{{ formState.sumRealAmount }} {{ currencyCode
                }}</span></div>
                <div><span class="label">总付款金额</span> <span>{{ formState.sumAmount }} {{ currencyCode }}</span></div>
            </div>
        </div>
        <a-button class="bg-#2C261B mt-24px w-114px h-40px c-#fff" html-type="submit" @click="handleSubmitCard">提交</a-button>
    </div>
</template>
<script setup lang="jsx">
import { ref, computed, reactive, onMounted, onBeforeMount, watch, unref } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import * as cardApis from "../services/card";
import * as cardholderApis from "../services/cardholder";
import { useUserStore } from "../stores/user";
import { debounce } from "lodash-es";
import SelectedWalletImg from '../components/icons/selectedWallet.vue'
import { useFile } from '../hooks/useFile'

const currencyFile = (imgFile) => {
    return useFile(imgFile)
}

const userStore = useUserStore();

const openCardStepTypes = {
    OPEN_CARD: 'openCard',
    CHARGE_CARD: 'chargeCard',
    CHARGE_CARD_PAY: 'chargeCardPay',
    SHARE_CARD_PAY: 'shareCardPay'
};
const openCardStep = ref('openCard');

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

const cardholder = ref([]);

const shareCard = ['Visa'];
const chargeCard = ['Master', 'Visa'];

let cardGroupList = ref([]);
const sectionNoList = ref([]);
const currencyCode = ref('');
const currencyWallet = ref(0);

let formState = reactive({
    amount: null, //金额
    count: null,//开卡数
    charge: null, //单卡到账金额
    cardholderId: null,//持卡人
    isShare: false,//类型
    cardLabel: 'Master',//卡组织
    cardId: '',//卡bin
    wallet: userStore.usdWallet.id, // 钱包币种
    "singleApplyFee": '', // 单卡手续费
    //   "singleRealAmount": '', // 单卡到账金额
    "sumAmount": '', // 总金额
    "sumApplyFee": '', // 总手续费
    "sumRealAmount": '' // 总到账金额
});

const router = useRouter()

const handleToCharge = (val) => {
    router.push({
        path: '/recharge-order'
    })
    console.log('充值');
}

// radio-group 和select 组建chang 事件的区别
const handeChangeCurrency = (e) => {
    const res = waArr.find(item => item.value === e.target.value);
    console.log('wallet===>', res)
    if (res) {
        currencyWallet.value = res?.usableQuota || 0
    } else {
        currencyWallet.value = 0;
    }
}

// 卡类型默认充值卡
// 所以卡组织默认 ['Master', 'Visa']
cardGroupList.value = chargeCard

const handleChangeCardType = (type) => {
    if (type) {
        cardGroupList.value = shareCard;
    } else {
        cardGroupList.value = chargeCard;
    }
    formState.cardId = '';
    formState.cardLabel = '';
}


// 卡组织默认值为['Master', 'Visa'],
onBeforeMount(() => {
    getAllCardGroup()

})

const getAllCardGroup = async () => {
    const cardListPromise = cardGroupList.value.map(val => cardApis.cardListAll({
        cardLabel: val
    }))
    Promise.all(cardListPromise).then((values) => {
        sectionNoList.value = values?.flat() || []
    })
}


/**
 *  "singleApplyFee":2, // 单卡手续费
                "singleRealAmount":1, // 单卡到账金额
                "sumAmount":12, // 总金额
                "sumApplyFee":10, // 总手续费
                "sumRealAmount":5 // 总到账金额
 */

const handleChargeChange = debounce(async (val) => {
    if (val >= 1) {
        const res = await cardApis.calcApplyFee({ 
            amount: val, 
            count: formState.count, 
            cardId: formState.cardId, 
            isShare: formState.isShare 
        });
        formState.charge = res?.singleRealAmount;
        formState.singleApplyFee = res?.singleApplyFee;
        formState.sumAmount = res?.sumAmount;
        formState.sumApplyFee = res?.sumApplyFee;
        formState.sumRealAmount = res?.sumRealAmount;
    }
}, 500);

// 
const formValid = ref(false);

watch(() => formState, async (newValue) => {
    formValid.value = false;
    // 验证
    await openCardFormRef.value.validate();

    formValid.value = true;
    // 计算
    handleChargeChange(unref(formState).amount)

}, { deep: true })

let cardRecords = ref([]);

const checkAmount = async (_rule, value) => {
    if (!value) {
        return Promise.reject("请输入金额");
    }
    if (value < 1) {
        return Promise.reject("开卡金额最小为 1");
    }
    return Promise.resolve();
};

const checkCount = async (_rule, value) => {
    if (!value) {
        return Promise.reject("请输入数量");
    }
    const isInt = /^[0-9]+$/.test(value)
    if (!isInt) {
        return Promise.reject('数量要求为正整数');
    }
    if (value <= 0) {
        return Promise.reject("数量不能小于1, 开卡数量 范围 1 - 20");
    }
    if (value > 20) {
        return Promise.reject("数量不能大于20， 开卡数量 范围 1 - 20");
    }
    return Promise.resolve();
};

const requestCardLoading = ref(false);

const handleSubmitCard = async () => {
    if (formValid === true) {
        try {
            requestCardLoading.value = true;
            await cardApis.requestCard(formState);
            message.success("开卡成功");
            requestCardLoading.value = false;
            window.location.href =
                window.location.origin + window.location.pathname + "#/card-list";
        } catch (error) {
            requestCardLoading.value = false;
        }
    }
};

const listCardHolderByUserId = async () => {
    const res = await cardholderApis.listByUserId();
    cardholder.value = res.map((it) => ({
        label: it.firstName + it.lastName,
        value: it.id,
    }));
};

onMounted(async () => {
    const res = await cardApis.paging({});
    cardRecords.value = res.records || [];
    listCardHolderByUserId();
});

let openCardFormRef = ref();

let waArr = reactive([]);

userStore.wallets.map((wa) => {
    waArr.push({
        value: wa.id,
        label: `${wa.currencyCode} 钱包（ ${wa.usableQuota}） `,
        code: wa.currencyCode,
        usableQuota: wa.usableQuota
    });
});

</script>
<style lang="less" scoped>
p.label {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 100%;
    margin-bottom: 12px;
}

.wallet-item-btn {
    border-radius: 6px;
    border: 1px solid #EAE9E8;

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

.share-radio-button {
    background-image: url('../assets/cards/sharedcard.png');
    width: 220px;
    height: 80px;
    border: unset;
    background-size:cover;

    .selectd-img {
        position: absolute;
        right: 0px;
        bottom: 0px;

    }
}

.card-bin-btn {
    border-radius: 6px;
    border: 1px solid #EAE9E8;
    width: 180px;
    height: 72px;
    padding: 0px;

    .selectd-img {
        position: absolute;
        right: 0px;
        bottom: 0px;

    }
}

.card-currency-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #EAE9E8;
    height: 36px;
    line-height: 36px;
    width: 80px;
    // padding: 10px 15px 10px 16px;
    // justify-content: center;
    // align-items: center;
    padding: 0px;
    border-radius: 6px;

    .selectd-img {
        position: absolute;
        right: 0px;
        bottom: 0px;

    }
}


.no-share-radio-button {
    background-image: url('../assets/cards/prepaidcard.png');
    width: 220px;
    height: 80px;
    background-color: unset;
    background-size: cover;

    .selectd-img {
        position: absolute;
        right: 0px;
        bottom: 0px;

    }
}



::v-deep .ant-radio-button-wrapper-checked.radio-item {
    border-radius: 6px;
    border: 1px solid #F65050;
    background-color: #FFF;
    border-right-color: #F65050 !important;
    color: unset;

}


.no-share-radio-button.ant-radio-button-wrapper {
    border: unset;
}

::v-deep .ant-radio-button-wrapper:not(:first-child)::before {
    display: none;
}

.cardholder-select,
.count-input {
    height: 36px;
    line-height: 36px;
    border-radius: 6px;
    color: #2C261B
}

.amount-input.ant-input-affix-wrapper {
    height: 36px;
    line-height: 36px;
    border-radius: 6px;
    color: #2C261B;
}


::v-deep .ant-select-single:not(.ant-select-customize-input) .ant-select-selector,
::v-deep .ant-select-single:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input {
    height: 36px;
}



.wrap-box {
    background: #f6f6f6;
    margin: -24px;

    .page {
        background: #fff;
        padding: 24px;
    }
}


.pay_comfirm_wrapper {
    padding: 24px 36px;
    border-radius: 6px;
    background: #FFF;

    .label {
        color: #2C261B;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 100%;
        /* 14px */
    }

    span {
        color: #2C261B;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%;
        opacity: 0.7;

    }
}

.apply_charge_card_wrapper {
    padding: 25px;
    background-color: #f5f5f9;
    margin-bottom: 20px;
}

.pay_comfirm_title,
.apply_charge_card_title {
    color: #a99d9d;
}

.currency-code {
    line-height: 30px;
    margin-left: 10px;
}
</style>
