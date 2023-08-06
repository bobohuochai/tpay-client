<template>
  <div class="page page-recharge-order">
    <WalletLeft></WalletLeft>
    <a-card :style="{ marginBottom: '1em' }">
      <h2>账户充值</h2>
      <a-form
        name="recharge-order-form"
        layout="horizontal"
        :model="formState"
        :labelCol="{
          span: 2,
        }"
        @finish="onFinish"
      >
        <a-form-item
          label="充值金额"
          name="remittanceAmount"
          :rules="[{ required: true, validator: checkAmount }]"
        >
          <a-input-number
            style="width: 300px"
            v-model:value="formState.remittanceAmount"
            :precision="2"
            placeholder="请输入充值金额"
            allowClear
          >
          </a-input-number>
          <a-select
            style="width: 100px"
            :options="remittanceCurrencyOption"
            v-model:value="formState.remittanceCurrency"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="币种钱包"
          name="walletId"
          :rules="[{ required: true, message: '请选择钱包' }]"
        >
          <a-radio-group
            v-model:value="formState.walletId"
            button-style="solid"
            class="card-bin"
          >
            <a-radio-button
              v-for="item in userStore.userInfo.walletVos"
              :key="item"
              :value="item.id"
              class="select-item"
            >
              {{ `${item.currencyCode} 钱包: (${item.usableQuota})` }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <!-- <a-form-item
          label="汇款币种"
          name="remittanceCurrency"
          :rules="[{ required: true, message: '请选择汇款币种' }]"
        >
          <a-radio-group
            v-model:value="formState.remittanceCurrency"
            button-style="solid"
            class="card-bin"
          >
            <a-radio-button
              v-for="item in remittanceCurrencyOption"
              :key="item"
              :value="item.value"
              class="select-item"
            >
              {{ `${item.label}` }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="预计到账">
          <!-- <a-input-number
            style="width: 300px"
            v-model:value="previewAmount"
            :precision="2"
            placeholder=""
            allowClear
          >
          </a-input-number> -->
          <template v-if="selectedWallet">
            <b>{{ previewAmount }} {{ selectedWallet.currencyCode }}</b>
            <!-- <template v-if="selectedWallet" >
              <span style='margin-left:5px'>{{ selectedWallet.currencyCode }}</span>
            </template> -->
              <template v-if="selectedWallet && formState.remittanceCurrency !== selectedWallet.currencyCode" >
                （1.00 {{ selectedWallet.currencyCode }} = {{ onlineRate }} {{ formState.remittanceCurrency }} ，更新于今天: {{ refreshDate }}）
              </template>
          </template>
        </a-form-item>
        <a-form-item
          label="汇款方式"
          name="receiptChannel"
          :rules="[{ required: true, message: '请选择汇款方式' }]"
        >
          <a-radio-group
            @change="handleChangeChannel(formState.receiptChannel)"
            v-model:value="formState.receiptChannel"
            button-style="solid"
            class="card-item"
          >
            <a-radio-button
              v-for="item in receiptChannels"
              :key="item.key"
              :value="item.value"
              class="select-item"
            >
              {{ `${item.value}` }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="收款账户"
          name="receiptAccountId"
          :rules="[{ required: true, message: '请选择收款账户' }]"
        >
          <a-select
            @change="handleChagneAccountId(formState.receiptAccountId)"
            style="width: 300px"
            :options="receiptAccounts"
            v-model:value="formState.receiptAccountId"
            placeholder="请选择收款账户"
            allowClear
          ></a-select>
          <a-button @click="handleCopy(formState.receiptAccountId)"
            >复制</a-button
          >
          <div
            v-if="formState.receiptAccountId && accountData"
            class="account-wrapper"
          >
            <div class="item-list" v-if="accountData.accountName">
              AccountName: <span> {{ accountData.accountName }}</span>
            </div>
            <div class="item-list" v-if="accountData.supportedCurrencies">
              Supported Currencies:
              <span> {{ accountData.supportedCurrencies }}</span>
            </div>
            <div class="item-list" v-if="accountData.bankName">
              Bank Name: <span> {{ accountData.bankName }}</span>
            </div>
            <div class="item-list" v-if="accountData.bankAddress">
              Bank Address: <span> {{ accountData.bankAddress }}</span>
            </div>
            <div class="item-list" v-if="accountData.country">
              Country/Region: <span> {{ accountData.country }}</span>
            </div>
            <div class="item-list" v-if="accountData.swiftCode">
              SwiftCode/BIC: <span> {{ accountData.swiftCode }}</span>
            </div>
          </div>
        </a-form-item>
        <a-form-item
          label="凭证照片"
          name="fileList"
          :rules="[{ required: true, message: '请选择凭证' }]"
        >
          <a-upload
            v-model:file-list="formState.fileList"
            name="fileList"
            accept="image/png, image/jpeg, image/jpg"
            :maxCount="1"
            :customRequest="uploadFile"
          >
            <a-button>
              <upload-outlined></upload-outlined>
              上传凭证
            </a-button>
            <span style="color: #979090; font-size: 12px"
              >（文件格式: jpg,jpeg,png, 文件大小限制：10M)</span
            >
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 2 }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
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
import WalletLeft from "../components/WalletLeft.vue";
import { checkAmount } from "../helpers/utils";

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
];
const onlineRate = ref(0);
const refreshDate = ref('');

const formState = reactive({
  walletId: null, //钱包
  remittanceAmount: null, // 汇款金额
  remittanceCurrency: "USD", // 币种
  receiptChannel: "", // 汇款方式
  receiptAccountId: null, // 汇款账户
  fileList: [], // 凭证
});

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
      accounts.push({
        label: element.account,
        value: element.id,
        data: element,
      });
    });
    receiptAccounts.value = accounts;
  }
};

const onError = (e) => {
  console.log(444, e);
};

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
    formState.remittanceAmount = "";
    formState.remittanceCurrency = "USD";
    formState.remittanceType = "";
    formState.recevieAccount = "";
    formState.fileList = [];
  } else {
    message.warn("请勿重复提交");
  }
};

let previewAmount = ref('');

watchEffect(async () => {
  if (
    formState.remittanceCurrency &&
    formState.walletId &&
    formState.remittanceAmount
  ) {
    const res = await rechargeLogApis.calcRechargeFee({
      sourceCode: formState.remittanceCurrency, // 汇款币种
      toCode: selectedWallet.value.currencyCode, // 币种钱包
      amount: formState.remittanceAmount,
    });
    previewAmount.value = res.realAmount;
    onlineRate.value = res.onlineRate;
    refreshDate.value = res.refreshDate;
  } else {
    previewAmount.value = '';
    onlineRate.value = 0;
    refreshDate.value = '';
  }
});

onMounted(async () => {
  const channels = await receiptAccountApis.groupByChannel();
  receiptChannels.value = channels.map((it) => ({
    key: it,
    value: it,
  }));
});
</script>

<style scoped>
.select-item {
  margin-right: 20px;
}
.account-wrapper .item-list {
  margin: 5px 0;
}
</style>