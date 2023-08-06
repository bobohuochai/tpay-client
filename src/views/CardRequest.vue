<template>
  <div class="page page-card-request">
    <h2>申请卡</h2>
    <a-card v-show="openCardStep === 'openCard'">
      <a-form
        ref="openCardFormRef"
        name="card-request-form"
        layout="horizontal"
        :labelCol="{
          span: 2,
        }"
        :model="formState"
        @finish="onFinish"
      >
        <a-form-item
          label="卡片类型"
          name="isShare"
          :rules="[{ required: true, message: '请选择卡片类型' }]"
          @change="handleChangeCardType(formState.isShare)"
        >
          <a-radio-group v-model:value="formState.isShare" button-style="solid" class="card-type">
            <a-radio-button :value="false">充值卡</a-radio-button>
            <!-- <a-radio-button :value="true">共享卡</a-radio-button> -->
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="卡组织"
          name="cardLabel"
          :rules="[{ required: true, message: '请选择卡组织' }]"
        >
          <a-radio-group 
            @change="handleChangeCardGroup(formState.cardLabel)"
            v-model:value="formState.cardLabel"
            button-style="solid"
            class="card-group"
          >
            <a-radio-button
              :key="`card_list_group_${index}`"
              v-for="(item, index) in cardGroupList"
              :value="item"
            >
              {{item}}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="卡Bin"
          name="cardId"
          :rules="[{ required: true, message: '请选择卡Bin' }]"
        >
          <a-radio-group
            @change="handleChangeCardId(formState.cardId)"
            v-model:value="formState.cardId"
            button-style="solid"
            class="card-bin"
          >
            <a-radio-button
              v-for="item in sectionNoList"
              :key="item.id"
              :value="item.id"
            >
              {{  item.label }}
            </a-radio-button>
          </a-radio-group>
          <div v-if="formState.cardId && cardData" class="card-wrapper">
            <div class="item-list" v-if="cardData.region"> 地区: <span> {{ cardData.region }}</span></div>
            <div class="item-list" v-if="cardData.currencyName"> 结算币种: <span> {{ cardData.currencyName}}</span></div>
          </div>
        </a-form-item>
        <a-form-item
          label="卡币种"
          name="currencyId"
          :rules="[{ required: true, message: '请选择卡币种' }]"
        >
          <a-select
            :allowClear="true"
            v-model:value="formState.currencyId"
            button-style="solid"
            class="card-currency"
            :options="currencyOptions"
            @change="handelChangeCurrencyCode(formState.currencyId)"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          label="开卡数"
          name="count"
          :rules="[
            { required: true, validator: checkCount, trigger: 'change' },
          ]"
        >
          <a-input
            v-model:value="formState.count"
            placeholder="请输入数量"
            type="number"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label="持卡人"
          name="cardholderId"
          :rules="[{ required: true, message: '请选择持卡人' }]"
        >
          <a-select
            :options="cardholder"
            v-model:value="formState.cardholderId"
            placeholder="请选择持卡人"
            allowClear
          ></a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 22, offset: 2 }">
          <a-button
            type="primary"
            @click="handleNext()"
          >
            下一步
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card v-show="openCardStep === 'chargeCard'">
      <p class="apply_charge_card_title">申请充值卡</p>
      <div class="apply_charge_card_wrapper">
        <a-form
          name="card-apply-card-form"
          layout="horizontal"
          :labelCol="{
            span: 2,
          }"
          :model="formState"
          ref="applyCardRef"
          @finish="handleApplyCardFinish"
        >
          <a-form-item
            label="余额账户"
            name="wallet"
            :labelCol="{span: 3, offset: 0}"
            :rules="[{ required: true, message: '请选择余额账户' }]"
          >
            <a-select
              style="width: 400px;"
              :allowClear="true"
              v-model:value="formState.wallet"
              button-style="solid"
              class="card-currency"
              :options="waArr"
              placeholder="请选择余额账户"
              @change="handeChangeCurrency"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            label="单卡充值金额"
            name="amount"
            :labelCol="{span: 3, offset: 0}"
            :rules="[{ required: true, validator: checkAmount }]"
          >
            <div style="display: flex;">
              <a-input
                style="width: 400px;"
                v-model:value="formState.amount"
                type="number"
                @change="handleChargeChange(formState.amount)"
              >
              </a-input>
              <span class="currency-code"> {{ currencyCode }}</span>
            </div>
          </a-form-item>
          <a-form-item
            label="单卡到账金额"
            name="charge"
            :labelCol="{span: 3, offset: 0}"
            :rules="[{ required: true, message: '请输入单卡到账金额' }]"
          >
            <div style="display: flex;">
              <a-input
                style="width: 400px;"
                v-model:value="formState.charge"
                :disabled="true"
              >
              </a-input>
              <span class="currency-code"> {{ currencyCode }}</span>
            </div>
          </a-form-item>
          <a-form-item
            :wrapperCol="{span: 8, offset: 3}"
          >
            <a-button
              type="primary"
              @click="handleChargeCardPrev()"
            >
              返回
            </a-button>
            <a-button
              v-if="currencyWallet < formState.amount"
              style="margin-left: 10px;"
              type="primary"
              @click="handleToCharge()"
            >
              余额不足，去充值
            </a-button>
            <a-button
              v-else
              :loading="requestCardLoading"
              style="margin-left: 10px;"
              type="primary"
              @click="handleChargeCardNext()"
            >
              下一步
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-card>
    <a-card v-show="openCardStep === 'chargeCardPay'">
      <h2>付款确认</h2>
      <p class="pay_comfirm_title">费用信息</p>
      <div class="pay_comfirm_wrapper">
        <p>开卡卡数: {{ formState.count }}</p>
        <p>开卡手续费: {{ formState.singleApplyFee }} {{ currencyCode }}</p>
        <p>总计手续费: {{ formState.sumApplyFee }} {{ currencyCode }}</p>
      </div>
      <a-form-item :wrapper-col="{ span: 22, offset: 0 }">
          <a-button
            type="primary"
            @click="handleChargeCardPayPrev()"
          >
            返回
          </a-button>
          <a-button
            :loading="requestCardLoading"
            type="primary"
            style="margin-left: 10px;"
            html-type="submit"
            @click="handleSubmitCard"
          >
           提交
          </a-button>
        </a-form-item>
    </a-card>
    <a-card v-show="openCardStep === 'shareCardPay'">
      <h2>付款确认</h2>
      <p class="pay_comfirm_title">费用信息</p>
      <div class="pay_comfirm_wrapper">
        <p>开卡卡数: {{ formState.count }}</p>
        <p>开卡手续费: {{ formState.singleApplyFee }} {{ currencyCode }}</p>
        <p>总计手续费: {{ formState.sumApplyFee }} {{ currencyCode }}</p>
      </div>
      <a-form-item :wrapper-col="{ span: 22, offset: 0 }">
        <a-button
          type="primary"
          @click="handleShareCardPayPrev()"
        >
          返回
        </a-button>
    
        <a-button
          style="margin-left: 20px;"
          type="primary"
          html-type="submit"
          @click="handleSubmitCard"
        >
          提交 
        </a-button>
      </a-form-item>
    </a-card>
  </div>
</template>
<script setup lang="jsx">
import { ref, computed, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import * as cardApis from "../services/card";
import * as cardholderApis from "../services/cardholder";
import { useUserStore } from "../stores/user";
import { debounce } from "lodash-es";

const userStore = useUserStore();

let openCardStepTypes = {
  OPEN_CARD: 'openCard',
  CHARGE_CARD: 'chargeCard',
  CHARGE_CARD_PAY: 'chargeCardPay',
  SHARE_CARD_PAY: 'shareCardPay'
};
let openCardStep = ref('openCard');

const currencyOptions = ref([]);


const handelChangeCurrencyCode = (val) => {
  const res = currencyOptions.value.find(item => item.value === val);
  if (res) {
    currencyCode.value = res?.label || '';
    formState.currency = res?.label || ''
  } else {
    formState.currency = ''
    currencyCode.value = '';
  }
}

const statusMap = reactive({
  0: "允许",
  1: "维护中",
  2: "关闭",
});

const cardholder = ref([]);

const shareCard =['Visa'];
const chargeCard =['Master', 'Visa'];

let cardGroupList = ref([]);
const sectionNoList = ref([]);
const currencyCode = ref('');
const currencyWallet = ref(0);

let formState = reactive({
  amount: null, //金额
  count: null,//开卡数
  charge: null, //预计到账金额
  cardholderId: null,//持卡人
  isShare: '',//类型
  cardLabel: '',//卡组织
  cardId: '',//卡bin
  currencyId: '',//币种
  currency: '', //USD
  singleApplyFee: '',
  sumApplyFee: ''
});

const router = useRouter()
const handleToCharge = (val) => {
  router.push({
    path: '/recharge-order'
  })
  console.log('充值');
}

const handeChangeCurrency = (val) => {
  const res = waArr.find(item => item.value === val);
  if (res) {
    currencyWallet.value = res?.usableQuota || 0
  } else {
    currencyWallet.value = 0;
  }
}

const handleChangeCardType = (type) => {
  if (type) {
    cardGroupList.value = shareCard;
  } else {
    cardGroupList.value = chargeCard;
  }
  formState.cardId = '';
  formState.cardLabel = '';
}

const handleChangeCardGroup = async (val) => {
  // const group = cardGroupList.value.find(item => item.id === val);
    // sectionNoList.value = [group.sectionNo] || [];
  const res = await cardApis.cardListAll({
    cardLabel: val
  });

  let sectionNo = [];

  if (res.length) {
    res.forEach(element => {
      sectionNo.push({
        id: element.id,
        label: element.sectionNo,
        region: element.region,
        currencyName: element.currencyName,
      })
    });
    sectionNoList.value = sectionNo;
  }
  formState.cardId = '';
}

const handleChargeChange = debounce(async (val) => {
  if (val >= 0.01) {
    const res = await cardApis.calcApplyFee({ amount: val, count: formState.count, cardId: formState.cardId, isShare: formState.isShare });
    formState.charge = res?.realAmount;
    formState.sumApplyFee = res?.sumApplyFee;
    formState.singleApplyFee = res?.singleApplyFee;
  }
}, 500);

let cardData = ref({});
const handleChangeCardId = (cardId) => {
  sectionNoList.value.forEach(element => {
    if (element.id === cardId) {
      cardData.value = element
    }
  });
}

const skuHeight = ref("auto");

const onClickSkuHeight = () => {
  if (skuHeight.value === "auto") {
    skuHeight.value = "20px";
  } else {
    skuHeight.value = "auto";
  }
};

let cardRecords = ref([]);

const selectedCard = computed(() => {
  if (formState.id && cardRecords.value && cardRecords.value.length) {
    const ca = cardRecords.value.find((ca) => ca.id === formState.id);
    if (ca) {
      return ca;
    }
  }
});


const checkAmount = async (_rule, value) => {
  if (!value) {
    return Promise.reject("请输入金额");
  }
  if (userStore.userInfo.hasCards !== undefined && userStore.userInfo.hasCards === true && value < 0.01) {
    return Promise.reject("金额最小为 0.01");
  } else if (userStore.userInfo.hasCards !== undefined && userStore.userInfo.hasCards === false && value < 1) {
    // 首次开卡时的开卡金额不能小于1
    return Promise.reject("首次开卡的金额最小为 1");
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
};


const handleApplyCardFinish = (val) => {
  console.log(values);
}

const listCardHolderByUserId = async () => {
  const currencys = await cardApis.queryCurrencys();
  currencyOptions.value = currencys.map((it) => ({
    label: it.currency,
    value: it.id,
  }));

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

  // const cardListRes = await cardApis.cardList();
  // cardGroupList.value = cardListRes || [];
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

const handleNext = async () => {
  await openCardFormRef.value.validate();
  if (formState.isShare == false) {
    openCardStep.value = openCardStepTypes.CHARGE_CARD;
  } else {
    const res = await cardApis.calcApplyFee({ amount: 0, count: formState.count, cardId: formState.cardId, isShare: formState.isShare });
    formState.charge = res?.realAmount;
    formState.sumApplyFee = res?.sumApplyFee;
    formState.singleApplyFee = res?.singleApplyFee;
    openCardStep.value = openCardStepTypes.SHARE_CARD_PAY;
  }
}

let applyCardRef = ref();
const handleChargeCardNext = async () => {
  await applyCardRef.value.validate();
  openCardStep.value = openCardStepTypes.CHARGE_CARD_PAY;
}
const handleChargeCardPrev = () => {
  formState.amount = ''
  formState.wallet = '';
  formState.charge = '';
  openCardStep.value = openCardStepTypes.OPEN_CARD;
}
const handleShareCardPayPrev = () => {
  openCardStep.value = openCardStepTypes.OPEN_CARD;
}
const handleChargeCardPayPrev = () => {
  openCardStep.value = openCardStepTypes.CHARGE_CARD;
}
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
.card-type, .card-group, .card-bin {
  .ant-radio-button-wrapper:not(:first-child) {
    margin-left: 20px;
  }
}
.pay_comfirm_wrapper {
  padding: 10px;
  background-color: #f5f5f9;
  margin-bottom: 20px;
}
.apply_charge_card_wrapper {
  padding: 25px;
  background-color: #f5f5f9;
  margin-bottom: 20px;
}
.pay_comfirm_title, .apply_charge_card_title {
  color: #a99d9d;
}
.currency-code {
  line-height: 30px;
  margin-left: 10px;
}
.card-wrapper .item-list {
  margin: 5px 0;
}
</style>
