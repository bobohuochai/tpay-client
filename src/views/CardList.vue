<template>
  <div class="page page-card-request">
    <div class="form-wrapper">
      <a-form
          name="card-list-form"
          layout="inline"
          :model="formState"
          @finish="onFinish"
      >
        <a-form-item label="卡号" name="cardNumberLastFour">
          <a-input
              v-model:value="formState.cardNumberLastFour"
              placeholder="请输入卡号"
          >
          </a-input>
        </a-form-item>
        <a-form-item label="状态" name="cardStatus">
          <a-select
            style="width: 100px;"
            :options="cardStatusEnum"
            v-model:value="formState.cardStatus"
            placeholder="状态"
            allowClear
          >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">查询</a-button>
        </a-form-item>
        <a-form-item>
          <ExportButton @success="showDownloadModal(record)"></ExportButton>
        </a-form-item>
      </a-form>
    </div>
    <a-table
        bordered
        :columns="columns"
        :data-source="userCardPagingRes.records"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <a-space v-if="column.dataIndex === 'operate'">
          <a @click="showLookModal(record)">查看卡详情</a>
          <a @click="showEditModal(record)">卡备注</a>

          <a
              v-if="
              record.cardStatus === 'ACTIVE' &&
              record.verifyFreezeUnFreezeCardStatus === 0
            "
              @click="showBlockModal('冻结', record)"
          >冻结</a>
          <a
              v-if="
              record.cardStatus === 'REVOKED' &&
              record.verifyFreezeUnFreezeCardStatus === 0
            "
              @click="showBlockModal('解冻', record)"
          >解冻</a>
          <a
              v-if="
              record.cardStatus === 'ACTIVE' &&
              record.verifyCloseCardStatus === 0
            "
              @click="showCloseModal(record)"
          >注销</a>

          <a
              v-if="
              record.cardStatus === 'ACTIVE' &&
              record.verifyCloseCardStatus === 0
            "
              @click="showPayModal('充值', record)"
          >充值</a>
          <a
              v-if="
              record.cardStatus === 'ACTIVE' &&
              record.verifyCloseCardStatus === 0 &&
              record.usableQuota > 0
            "
              @click="showPayModal('退回', record)"
          >余额退回</a>

        </a-space>
      </template>
    </a-table>
    <a-modal
        :width="700"
        v-model:visible="payModalConfig.show"
        :title="payModalConfig.title"
        @ok="onPayModalOk"
    >
      <p>卡号：{{ payModalConfig.record.cardNumber }}</p>
      <p>备注：{{ payModalConfig.record.remark }}</p>
      <p>卡组：{{ payModalConfig.record.cardType }}</p>
      <p>卡币种：{{ payModalConfig.record.currencyCode }}</p>
      <p>卡余额：{{ payModalConfig.record.usableQuota }}</p>
      <a-form ref="payModalFormRef" :model="formState">
        <a-form-item
          label="币种钱包"
          name="walletId"
          :rules="[{ required: true, message: '请选择币种钱包' }]"
        >
          <a-radio-group
            v-model:value="formState.walletId"
            button-style="solid"
            class="card-item"
          >
            <a-radio-button
              v-for="item in userStore.userInfo.walletVos"
              :key="item"
              :value="item.id"
              class="select-item selct-item-currency"
            >
              {{ `${ item.currencyCode } 钱包: (${ item.usableQuota})` }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item
            name="amount"
            :label="`${payModalConfig.title}金额`"
            :rules="[{ required: true, message: '请输入金额' }]"
        >
          <a-input
              type="number"
              placeholder="请输入金额"
              v-model:value="formState.amount"
          />
        </a-form-item>
      </a-form>
      <a-form-item label="到账金额">
        {{ previewAmount }}
        <template v-if="selectedWallet">
          {{ selectedWallet.currencyCode }}
        </template>
      </a-form-item>
    </a-modal>
    <a-modal
        v-model:visible="editModalConfig.show"
        title="编辑"
        @ok="onEditModalOk"
    >
      <div>
        <p>卡号：{{ editModalConfig.record.cardNumber }}</p>
        <a-form ref="editModalFormRef" :model="editModalConfig.record">
          <a-form-item name="remark" label="备注">
            <a-textarea
                placeholder="请输入备注"
                v-model:value="editModalConfig.record.remark"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <a-modal v-model:visible="lookModalConfig.show" title="卡片详情" :footer="null">
      <div>
        <a-form
            v-if="lookModalConfig.showPayPassword"
            ref="lookModalFormRef"
            layout="inline"
            :style="{ marginBottom: '20px' }"
            :model="lookModalConfig.formState"
            @finish="onLookModalFormFinish"
        >
          <a-form-item name="payPassword" label="支付密码">
            <a-input
                placeholder="请输入支付密码"
                type="password"
                v-model:value="lookModalConfig.formState.payPassword"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit">提交</a-button>
          </a-form-item>
        </a-form>
        <div v-if="lookModalConfig.cardUserInfo">
          <p>
            卡号：{{ lookModalConfig.cardUserInfo.cardNumber }}
            <a @click="handleCopy(lookModalConfig.cardUserInfo.cardNumber)">复制卡号</a>
          </p>
          <p>cvv：{{ lookModalConfig.cardUserInfo.vcc }}</p>
          <p>有效期：{{ lookModalConfig.cardUserInfo.expiry }}</p>
          <div v-if="lookModalConfig.cardUserInfo.cardholderVo !== null">
            <p>持卡人：{{ lookModalConfig.cardUserInfo.cardholderVo.firstName }}{{ lookModalConfig.cardUserInfo.cardholderVo.lastName }}</p>
            <p>地址：{{ lookModalConfig.cardUserInfo.cardholderVo.city }} {{ lookModalConfig.cardUserInfo.cardholderVo.area }}</p>
            <p>邮编：{{ lookModalConfig.cardUserInfo.cardholderVo.postCode }}</p>
            <p>联系电话：{{ lookModalConfig.cardUserInfo.cardholderVo.phone }}</p>
            <p>邮箱：{{ lookModalConfig.cardUserInfo.cardholderVo.email }}</p>
            <p>备注：{{ lookModalConfig.cardUserInfo.cardholderVo.remark }}</p>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:visible="downloadModalConfig.show" title="身份验证" :footer="null">
      <a-form
        ref="downloadModalFormRef"
        :model="downloadModalConfig.formState"
        @finish="checkCanDownload"
      >
        <a-form-item label="验证方式" name="authType">
          <a-radio-group v-model:value="downloadModalConfig.formState.authType">
            <a-radio-button
              v-for="item in authTypes"
              :key="item.key"
              :value="item.value"
            >{{ `${item.label}` }}</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item 
          name="payPassword" 
          label="支付密码"
          v-if="downloadModalConfig.formState.authType == 'payPassword'"
        >
          <a-input
              placeholder="请输入支付密码"
              type="password"
              v-model:value="downloadModalConfig.formState.payPassword"
          />
        </a-form-item>
        <a-form-item 
          label="验证码类型" 
          name="authCodeType" 
          v-if="downloadModalConfig.formState.authType == 'authCode'"
        >
          <div style="display: flex;">
            <a-select v-model:value="downloadModalConfig.formState.authCodeType" :allow-clear="true">
              <a-select-option value="0">手机验证</a-select-option>
              <a-select-option value="1">邮箱验证</a-select-option>
            </a-select>
            <a-button class="btn-send" @click="handleSendMessageCode()" :disabled="canSendCheck()">发送验证码</a-button>
            <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
          </div>
        </a-form-item>
        <a-form-item 
          label="验证码" 
          name="authCode" 
          v-if="downloadModalConfig.formState.authType == 'authCode'"
        >
          <a-input placeholder="输入验证码" v-model:value="downloadModalConfig.formState.authCode"></a-input>
          <span v-if="isSending" class="send-message-count">{{ canSendCount }}(S)</span>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        v-model:visible="blockModalConfig.show"
        :title="blockModalConfig.title"
        @ok="onBlockModalOk"
    >
      <div>
        <p>卡号：{{ blockModalConfig.record.cardNumber }}</p>
        <p>卡备注：{{ blockModalConfig.record.remark }}</p>
      </div>
    </a-modal>
    <a-modal
        v-model:visible="closeModalConfig.show"
        title="是否销卡"
        @ok="onCloseModalOk"
    >
      <div>
        <p>卡号：{{ closeModalConfig.record.cardNumber }}</p>
        <p>卡备注：{{ closeModalConfig.record.remark }}</p>
      </div>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, reactive, ref, onMounted, watchEffect } from "vue";
import { message, Modal, Button } from "ant-design-vue";
import { downloadFromRes, checkAmount } from "../helpers/utils";
import ExportButton from "../components/ExportButton.vue";
import * as userCardApis from "../services/userCard";
import * as userApis from "../services/user";
import * as messageApis from "../services/message";
import { useUserStore } from "../stores/user";
import { useSendMessage } from '../hooks/message-send.js';

const loading = ref(false);

const formState = reactive({
  remark: null,
  cardNumberLastFour: null,
  targetUserId: null,
  cardStatus: null,
  userCardId: null,
  walletId: null,
  amount: null
});

let previewAmount = ref(0);

const cardStatusEnum = reactive([
  // 激活 ACTIVE 冻结 REVOKED 注销中 INCANCELED 已注销 CANCELED
  {
    label: "激活",
    value: "ACTIVE",
  },
  {
    label: "冻结",
    value: "REVOKED",
  },
  {
    label: "注销中",
    value: "INCANCELED",
  },
  {
    label: "已注销",
    value: "CANCELED",
  },
]);

let userCardPagingRes = ref({});

const pagination = computed(() => {
  return {
    total: Number(userCardPagingRes.value.total),
    pageSize: Number(userCardPagingRes.value.size),
    current: Number(userCardPagingRes.value.current),
  };
});

const columns = reactive([
  {
    title: "开卡日期",
    dataIndex: "requestDate",
  },
  {
    title: "卡号",
    dataIndex: "cardNumber",
  },
  {
    title: "卡片余额",
    dataIndex: "usableQuota",
    customRender({record}) {
      if (record.isShare === false) { // 共享卡不显示余额
        return `${record.usableQuota}${record.currencyCode}`;
      } else {
        return '--'
      }
    },
  },
  {
    title: "持卡人",
    customRender({record}) {
      return record.firstName + record.lastName;
    },
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "状态",
    dataIndex: "cardStatus",
    customRender({text}) {
      const r = cardStatusEnum.find((e) => e.value === text);
      return r?.label || "";
    },
  },
  {
    title: "更多",
    dataIndex: "operate",
  },
]);

const onExportBtn = async () => {
  const res = await userCardApis.derive(formState);
  downloadFromRes(res);
  downloadModalConfig.show = false;
};

const paging = async (params) => {
  loading.value = true;
  const userCardRes = await userCardApis.paging(params);
  loading.value = false;
  userCardPagingRes.value = userCardRes;
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

const payModalConfig = reactive({
  show: false,
  title: "充值",
  records: {},
});

const payModalFormRef = ref();

const showPayModal = (title, record) => {
  payModalConfig.title = title;
  payModalConfig.record = record;
  payModalConfig.show = true;
  formState.userCardId = record.id;
  formState.walletId = null;
  formState.amount = null;
  // 设置钱包的默认值
  for (let i = 0; i < userStore.userInfo.walletVos.length; i++) {
    const walletOne = userStore.userInfo.walletVos[i];
    if (walletOne.currencyCode === record.currencyCode) {
      formState.walletId = walletOne.id;
    }
  }
};

const onPayModalOk = async () => {
  // 点击时立即关闭窗口
  payModalConfig.show = false;
  await payModalFormRef.value.validate();
  const formValues = {}; //await payModalFormRef.value.validate();
  formValues.userCardId = payModalConfig.record.id;
  formValues.walletId = formState.walletId;
  formValues.amount = Number(formState.amount);
  if (payModalConfig.title === "充值") {
    await userCardApis.recharge(formValues);
    message.success("充值成功");
  } else {
    await userCardApis.out(formValues);
    message.success("转出成功");
  }
  refreshCurrentPage();
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

watchEffect(async () => {
  if (formState.amount && formState.walletId) {
    const payModalConfigRequestData = {
      "userCardId": formState.userCardId, // 汇款币种
      "walletId": formState.walletId, // 币种钱包
      "amount": formState.amount // 金额
    };
    if (payModalConfig.title === "充值") {
      const res = await userCardApis.calcCardRechargeFee(payModalConfigRequestData);
      previewAmount.value = res.realAmount;
    } else {
      const res = await userCardApis.calcCardOutFee(payModalConfigRequestData);
      previewAmount.value = res.realAmount;
    }
  } else {
    previewAmount.value = 0;
  }
});

const editModalConfig = reactive({
  show: false,
  records: {},
  formState: {
    amount: null,
  },
});

const editModalFormRef = ref();

const showEditModal = (record) => {
  editModalConfig.record = record;
  editModalConfig.show = true;
};

const onEditModalOk = async () => {
  const formValues = await editModalFormRef.value.validate();
  await userCardApis.updateRemark({
    id: editModalConfig.record.id,
    remark: editModalConfig.record.remark,
  });
  message.success("修改备注成功");
  refreshCurrentPage();
  editModalConfig.show = false;
};

const lookModalConfig = reactive({
  show: false,
  records: {},
  formState: {
    payPassword: null,
  },
  showPayPassword: false,
  cardUserInfo: null,
});

const lookModalFormRef = ref();

const userStore = useUserStore();

const showLookModal = async (record) => {
  lookModalConfig.record = record;
  if (userStore.isOpen) {
    lookModalConfig.showPayPassword = true;
    lookModalConfig.formState.payPassword = null;
    lookModalConfig.cardUserInfo = null;
    lookModalConfig.show = true;
    // what the fucking 
    // const data = await userCardApis.verifyPayPassword({});
    // lookModalConfig.showPayPassword = !data.flag;
    // if (data.flag) {
    //   const data = await userCardApis.showUserCardInfo({
    //     id: lookModalConfig.record.id,
    //   });
    //   lookModalConfig.cardUserInfo = data;
    // }
  } else {
    const data = await userCardApis.showUserCardInfo({
      id: lookModalConfig.record.id,
    });
    lookModalConfig.showPayPassword = false;
    lookModalConfig.formState.payPassword = null;
    lookModalConfig.cardUserInfo = null;
    lookModalConfig.show = true;
    lookModalConfig.cardUserInfo = data;
  }
};

const onLookModalFormFinish = async () => {
  let result = await userApis.checkPayPassword({
    payPassWord: lookModalConfig.formState.payPassword
  });
  if (result) {
    const data = await userCardApis.showUserCardInfo({
      id: lookModalConfig.record.id,
      payPassword: lookModalConfig.formState.payPassword,
    });
    lookModalConfig.cardUserInfo = data;
    lookModalConfig.showPayPassword = false;
  } else {
    message.error("支付密码不正确");
  }
};

const authTypes = [
  {
    label: "支付密码",
    value: "payPassword",
  },
  {
    label: "验证码",
    value: "authCode",
  },
];
const downloadModalConfig = reactive({
  show: false,
  records: {},
  formState: {
    authType: 'payPassword',
    payPassword: null,
    authCodeType: null,
    authCode: null
  },
});
const downloadModalFormRef = ref();
const showDownloadModal = async (record) => {
  downloadModalConfig.record = record;
  downloadModalConfig.formState.payPassword = null;
  downloadModalConfig.show = true;
};

let { canSendCount, isSending, canSendCheck, sendMessageCode } = useSendMessage(async () => {
  await userApis.sendAuthCode({
    type: formState.authCodeType
  })
  message.success('发送成功');
});
const handleSendMessageCode = async () => {
  await userApis.sendAuthCode({
        type: downloadModalConfig.formState.authCodeType
    })
    message.success('发送成功')
}

const checkCanDownload = async() => {
  if (downloadModalConfig.formState.authType === 'payPassword') {
    // 检查支付密码
    let result = await userApis.checkPayPassword({
      payPassWord: downloadModalConfig.formState.payPassword
    });
    if (result) {
      onExportBtn();
    } else {
      message.error("支付密码不正确");
    }
  } else {
    // 检查验证码
    let result = await messageApis.checkAuthCode({
      type: downloadModalConfig.formState.authCodeType,
      authCode: downloadModalConfig.formState.authCode
    });
    if (result) {
      onExportBtn();
    } else {
      message.error("验证码不正确");
    }
  }
}

const blockModalConfig = reactive({
  title: "冻结",
  show: false,
  records: {},
});

const showBlockModal = (title, record) => {
  blockModalConfig.title = title;
  blockModalConfig.record = record;
  blockModalConfig.show = true;
};

const onBlockModalOk = async () => {
  await userCardApis.freezeAndUnFreeze({
    id: blockModalConfig.record.id,
    status: blockModalConfig.title === "冻结" ? true : false,
  });
  message.success(blockModalConfig.title === "冻结" ? "冻结成功" : "解冻成功");
  refreshCurrentPage();
  blockModalConfig.show = false;
};

const closeModalConfig = reactive({
  show: false,
  records: {},
});
const showCloseModal = (record) => {
  closeModalConfig.record = record;
  closeModalConfig.show = true;
};
const onCloseModalOk = async () => {
  await userCardApis.close({
    id: closeModalConfig.record.id
  });
  message.success("销卡成功");
  refreshCurrentPage();
  closeModalConfig.show = false;
};

onMounted(() => onFinish());

const handleCopy = function (val) {
  console.log(val);
  if (val) {
    const textValue = document.createElement("textarea"); // 创建DOM元素
    document.body.appendChild(textValue); // 将创建的DOM插入到Body上
    textValue.value = val; // 将数据赋值给创建的DOM元素的Value上
    textValue.select(); // 通过表单元素的select()方法选中内容
    document.execCommand("copy"); // 执行浏览器复制命令
    document.body.removeChild(textValue); // 移除DOM元素
    message.success("复制成功");
  }
};
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
.selct-item-currency:not(:first-child) {
  margin-left: 10px;
}
.send-message-count {
  padding: 0 5px;
  line-height: 32px;
  color: #958e8e;
}
</style>
