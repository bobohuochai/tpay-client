<template>
  <div class="page page-card-request">
    <a-table
      bordered
      :columns="columns"
      :data-source="rechargeLogPagingRes.records"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!-- <div v-if="column.dataIndex === 'rechargeFee'">
          <a @click="handleShowDetailFee(record.rechargeFee)" href="javascript:void(0)" > {{  record.rechargeFee.total }}</a>
        </div> -->
        <div v-if="column.dataIndex === 'imgSrc'">
          <PreviewImage :width="100" :fileName="record.img" />
        </div>
        <div v-if="column.dataIndex === 'operation'">
          <a
            v-if="
              userStore.userInfo.rolCode !== 'USER' &&
              record.status === 2 &&
              record.userId !== userStore.userInfo.id
            "
            @click="showEditModal(record)"
            >审核</a
          >
        </div>
      </template>
    </a-table>

    <!-- <a-modal v-model:visible="visible" title="手续费详情" @ok="handleOk" @cancel="handleOk">
      <div class="charge-fee-container">
        <ul class="charge-fee-wrapper">
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">开卡费:</span> {{  rechargeFeeData.applyCardFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">充值手续费:</span> {{  rechargeFeeData.chargeFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">小额交易费:</span> {{  rechargeFeeData.smallTransactionFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易手续费:</span> {{  rechargeFeeData.transactionFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">交易失败手续费:</span> {{  rechargeFeeData.failedFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">货币转化费:</span> {{  rechargeFeeData.conversionFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">撤销手续费:</span> {{  rechargeFeeData.discardFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">退款手续费:</span> {{  rechargeFeeData.refundFee }}</li>
          <li class="charge-fee-wrapper__item"><span class="charge-fee-wrapper__item-title">跨境交易费:</span> {{  rechargeFeeData.crossBorderTransactionFee }}</li>
        </ul>
      </div>
    </a-modal> -->

  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import * as rechargeLogApis from "../services/recharge-log";
import PreviewImage from "../components/PreviewImage.vue";

let rechargeLogPagingRes = ref({});
const loading = ref(false);

// let visible = ref(false);
// let rechargeFeeData = reactive({});

const pagination = computed(() => {
  return {
    total: Number(rechargeLogPagingRes.value.total),
    pageSize: Number(rechargeLogPagingRes.value.size),
    current: Number(rechargeLogPagingRes.value.current),
  };
});

const columns = reactive([
  {
    title: "时间",
    dataIndex: "requestDate",
  },
  {
    title: "到账金额",
    dataIndex: "amount",
    customRender({ record }) {
      return `${record.amount}${record.currencyCode}`;
    },
  },
  {
    title: "汇款金额",
    dataIndex: "amount",
    customRender({ record }) {
      return `${record.remittanceAmount}${record.remittanceCurrency ?? "CNY"}`;
    },
  },
  {
    title: "手续费",
    dataIndex: "fee",
    customRender({ record }) {
      return `${record.fee} ${record.currencyCode}`;
    },
  },
  {
    title: "币种钱包",
    dataIndex: "currencyCode",
  },
  {
    title: "凭证",
    dataIndex: "imgSrc",
  },
  {
    title: "状态",
    dataIndex: "status",
    customRender({ text, record }) {
      let str = "未知";
      if (text === 0) {
        str = "已入账";
      }
      if (text === 1) {
        str = "入账失败";
      }
      if (text === 2) {
        str = "待审核";
      }
      return str;
    },
  },
  {
    title: "打款方",
    dataIndex: "dealerAccount",
  }
]);

const handleOk = () => {
  console.log('x')
  visible.value = false;
}

// const handleShowDetailFee = (data) => {
//   visible.value = true;
//   rechargeFeeData = data;
// }

const handleTableChange = async (pag) => {
  const params = {};
  params.current = pag.current;
  params.size = pag.pageSize;
  fetchLogs(params);
};

const fetchLogs = async (params) => {
  loading.value = true;
  const res = await rechargeLogApis.paging(params);
  loading.value = false;
  rechargeLogPagingRes.value = res;
};

onMounted(() => fetchLogs());
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
.charge-fee-wrapper {
  margin: 0;
  padding: 0;
}
.charge-fee-wrapper__item {
  display: flex;
  margin: 10px 0;
}

.charge-fee-wrapper__item-title {
  width: 120px;
  margin-right: 25px;
  text-align: right;
}

</style>
