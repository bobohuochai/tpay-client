<template>
  <div class="page page-account-list">
    <div v-if="true">
<!--      <a-row justify="end" :style="{ marginBottom: '1em' }">-->
<!--        <a-space>-->
<!--          &lt;!&ndash; <a-button type="primary">转账</a-button> &ndash;&gt;-->
<!--          <a-button-->
<!--            type="primary"-->
<!--            @click="showCreateModal"-->
<!--            v-if="userStore.userInfo.roleCode !== 'USER'"-->
<!--            >创建账号</a-button-->
<!--          >-->
<!--        </a-space>-->
<!--      </a-row>-->
      <a-table
        bordered
        :columns="columns"
        :data-source="userPagingRes.records"
        :loading="userLoading"
        :pagination="false"
      >
<!--        <template #bodyCell="{ column, record }">-->
<!--          <div-->
<!--            v-if="-->
<!--              column.dataIndex === 'operation' &&-->
<!--              record.id !== userStore.userInfo.id-->
<!--            "-->
<!--          >-->
<!--            <a-space-->
<!--              ><a @click="updateStatus(record)">{{-->
<!--                record.status === 0 ? "冻结" : "解冻"-->
<!--              }}</a>-->
<!--              <a @click="showWalletModal('RECHARGE', record)">打款</a></a-space-->
<!--            ><br />-->
<!--            <a-space-->
<!--              ><a @click="showWalletModal('ROLLOFF', record)">转出</a>-->
<!--              <a @click="showConfigModal(record)">配置管理</a></a-space-->
<!--            >-->
<!--          </div>-->
<!--        </template>-->
      </a-table>
    </div>
    <a-result
      v-else
      status="error"
      title="暂无权限"
      sub-title="普通用户无权限查看该页面"
    >
    </a-result>
    <a-modal
      v-model:visible="createModalConfig.show"
      title="创建子账户"
      @ok="onCreateModalOk"
    >
      <a-form
        ref="createModalFormRef"
        :model="createModalConfig.formState"
        v-bind="createModalConfig.formLayout"
      >
        <a-form-item
          name="username"
          label="用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            placeholder="请输入用户名"
            v-model:value="createModalConfig.formState.username"
          />
        </a-form-item>
        <a-form-item name="remark" label="备注">
          <a-input
            placeholder="请输入备注"
            v-model:value="createModalConfig.formState.remark"
          />
        </a-form-item>
        <a-form-item
          name="password"
          label="密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input
            type="password"
            placeholder="请输入密码"
            v-model:value="createModalConfig.formState.password"
          />
        </a-form-item>
        <a-form-item
          name="rePassword"
          label="确认密码"
          :rules="[{ validator: validatorRePassword }]"
        >
          <a-input
            type="password"
            placeholder="请输入确认密码"
            v-model:value="createModalConfig.formState.rePassword"
          />
        </a-form-item>
        <a-form-item
          name="payPassword"
          label="支付密码"
          :rules="[{ required: true, message: '请输入支付密码' }]"
        >
          <a-input
            type="password"
            placeholder="请输入支付密码"
            v-model:value="createModalConfig.formState.payPassword"
          />
        </a-form-item>
        <a-form-item
          name="rePayPassword"
          label="确认支付密码"
          :rules="[{ validator: validatorRePayPassword }]"
        >
          <a-input
            type="password"
            placeholder="请输入确认密码"
            v-model:value="createModalConfig.formState.rePayPassword"
          />
        </a-form-item>
        <a-form-item
          name="email"
          label="邮箱"
          :rules="[{ required: true, message: '请输入邮箱' }]"
        >
          <a-input
            type="email"
            placeholder="请输入邮箱"
            v-model:value="createModalConfig.formState.email"
          />
        </a-form-item>
        <a-form-item
          name="account"
          label="手机号"
          :rules="[
            {
              required: true,
              pattern: /^[1][3-9][0-9]{9}$/,
              message: '请输入正确的手机号',
            },
          ]"
        >
          <a-input
            type="number"
            placeholder="请输入手机号"
            v-model:value="createModalConfig.formState.account"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="walletModalConfig.show"
      :title="walletModalConfig.title"
      @ok="onWalletModalOk"
    >
      <a-form
        ref="walletModalFormRef"
        :model="walletModalConfig.formState"
        v-bind="walletModalConfig.formLayout"
      >
        <a-form-item
          name="walletId"
          label="币种"
          :rules="[{ required: true, message: '请输入币种' }]"
        >
          <a-select
            placeholder="请输入币种"
            v-model:value="walletModalConfig.formState.walletId"
            :fieldNames="{
              label: 'currencyCode',
              value: 'id',
            }"
            :options="walletModalConfig.record.walletVos"
          />
        </a-form-item>
        <a-form-item
          name="amount"
          label="金额"
          :rules="[
            { required: true, validator: checkAmount, trigger: 'change' },
          ]"
        >
          <a-input
            type="number"
            placeholder="请输入金额"
            v-model:value="walletModalConfig.formState.amount"
          />
        </a-form-item>
        <a-form-item :label="`可${walletModalConfig.title}金额`">
          {{ walletModalConfigUsableQuota }}
        </a-form-item>
        <a-form-item name="remark" label="备注">
          <a-input
            placeholder="请输入备注"
            v-model:value="walletModalConfig.formState.remark"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      class="config-modal"
      width="70%"
      v-model:visible="configModalConfig.show"
      :title="configModalConfig.title"
      :footer="null"
    >
      <a-table
        bordered
        :data-source="configModalConfig.dataSource"
        :pagination="false"
      >
        <a-table-column dataIndex="sectionNo" title="号段" width="100px">
          <template #default="{ record }">
            {{ record.sectionNo }}
          </template>
        </a-table-column>
        <a-table-column dataIndex="amount" title="开卡费" width="100px">
          <template #default="{ record }">
            <a-input type="number" v-model:value="record.amount" />
          </template>
        </a-table-column>
        <a-table-column
          dataIndex="openCardOnLineCount"
          title="单次开卡上线"
          width="100px"
        >
          <template #default="{ record }">
            <a-input type="number" v-model:value="record.openCardOnLineCount" />
          </template>
        </a-table-column>
        <a-table-column
          dataIndex="exchangeRate"
          title="充值手续费"
          width="100px"
        >
          <template #default="{ record }">
            <a-input type="number" v-model:value="record.exchangeRate" />
          </template>
        </a-table-column>
        <a-table-column title="其他配置" width="120px">
          <template #default="{ record }">
            <a-checkbox
              :checked="!!record.verifyOpenCardStatus"
              @change="
                (e) => (record.verifyOpenCardStatus = e.target.checked ? 2 : 0)
              "
              >是否禁止开卡</a-checkbox
            >
            <br /><a-checkbox
              :checked="!!record.verifyRechargeCardStatus"
              @change="
                (e) =>
                  (record.verifyRechargeCardStatus = e.target.checked ? 2 : 0)
              "
              >是否禁止充值</a-checkbox
            >
            <br /><a-checkbox
              :checked="!!record.verifyOutCardStatus"
              @change="
                (e) => (record.verifyOutCardStatus = e.target.checked ? 2 : 0)
              "
              >是否禁止转出</a-checkbox
            >
            <br /><a-checkbox
              :checked="!!record.verifyCloseCardStatus"
              @change="
                (e) => (record.verifyCloseCardStatus = e.target.checked ? 2 : 0)
              "
              >是否禁止销卡</a-checkbox
            >
            <br /><a-checkbox
              :checked="!!record.verifyFreezeUnFreezeCardStatus"
              @change="
                (e) =>
                  (record.verifyFreezeUnFreezeCardStatus = e.target.checked
                    ? 2
                    : 0)
              "
              >是否禁止冻结</a-checkbox
            >
          </template>
        </a-table-column>
        <a-table-column title="更新" width="60px" align="center">
          <template #default="{ record }">
            <a-button type="primary" @click="updateConfig(record)"
              >更新</a-button
            >
          </template>
        </a-table-column>
      </a-table>
    </a-modal>
  </div>
</template>
<script setup>
import { computed, reactive, ref, onMounted, watch } from "vue";
import { message, Modal } from "ant-design-vue";
import { useUserStore } from "../stores/user";
import * as userApis from "../services/user";
import * as userCardApis from "../services/userCard";
import * as walletApis from "../services/wallet";

const userStore = useUserStore();

let userPagingRes = ref({});
const userLoading = ref(false);

const validatorRePassword = (rule, value, callback) => {
  console.log(value, createModalConfig.formState.password);
  if (value !== createModalConfig.formState.password) {
    callback("确认密码和密码必须一致");
    return;
  }
  callback();
};

const validatorRePayPassword = (rule, value, callback) => {
  console.log(2);
  if (value !== createModalConfig.formState.payPassword) {
    callback("确认支付密码和支付密码必须一致");
    return;
  }
  callback();
};

const columns = reactive([
  {
    title: "创建时间",
    dataIndex: "registerDate",
    width: 180,
  },
  // {
  //   title: "上级账户",
  //   dataIndex: "dealerAccount",
  //   width: 40,
  // },
  {
    title: "账户名",
    dataIndex: "username",
    width: 40,
  },
  {
    title: "账户Id",
    dataIndex: "id",
    width: 40,
  },
  {
    title: "账户余额",
    dataIndex: "walletVos",
    width: 40,
    customRender({ record }) {
      const arr = record.walletVos.map(
        (wa) => wa.usableQuota + wa.currencyCode
      );
      return arr.join("，");
    },
  },
  {
    title: "邮箱",
    dataIndex: "email",
    width: 80,
  },
  // {
  //   title: "角色",
  //   dataIndex: "roleName",
  //   width: 160,
  // },
  {
    title: "账户状态",
    dataIndex: "status",
    width: 160,
    customRender({ text }) {
      return text === 0 ? "正常" : "冻结";
    },
  },
  {
    title: "备注",
    dataIndex: "remark",
    width: 80,
  },
  // {
  //   title: "操作",
  //   dataIndex: "operation",
  //   width: 220,
  // },
]);

const fetchUsers = async () => {
  userLoading.value = true;
  const res = await userApis.paging({});
  userLoading.value = false;
  userPagingRes.value = res;
};

onMounted(fetchUsers);

// 创建账户
const createModalConfig = reactive({
  show: false,
  formState: {
    username: "",
    account: "",
    remark: "",
    password: "",
    rePassword: "",
    payPassword: "",
    rePayPassword: "",
    email: "",
  },
  formLayout: {
    labelCol: {
      span: 5,
    },
  },
});

const createModalFormRef = ref();

const showCreateModal = () => {
  createModalConfig.show = true;
  createModalConfig.formState.username = "";
  createModalConfig.formState.account = "";
  createModalConfig.formState.remark = "";
  createModalConfig.formState.password = "";
  createModalConfig.formState.rePassword = "";
  createModalConfig.formState.password = "";
  createModalConfig.formState.rePayPassword = "";
  createModalConfig.formState.email = "";
};

const onCreateModalOk = async () => {
  const formValues = await createModalFormRef.value.validate();
  await userApis.register(formValues);
  message.success("添加成功");
  fetchUsers();
  editModalConfig.show = false;
};

// 转出和打款
const walletModalConfig = reactive({
  show: false,
  title: "转出",
  formState: {
    walletId: null,
    amount: null,
    remark: null,
  },
  formLayout: {
    labelCol: {
      span: 4,
    },
  },
  record: {},
});

const walletModalConfigUsableQuota = computed(() => {
  const { formState, record, title } = walletModalConfig;
  const { walletId } = formState;
  if (walletId) {
    if (title === "转出" && record) {
      const { walletVos } = record;
      const wallet = walletVos.find((w) => w.id === walletId);
      return wallet && `${wallet.usableQuota}${wallet.currencyCode}`;
    }
    if (title === "打款") {
      const uWalletVos = userStore.userInfo.walletVos;
      const walletSelected = record.walletVos.find((w) => w.id === walletId);
      if (walletSelected) {
        const wallet = uWalletVos.find(
          (w) => w.currencyCode === walletSelected.currencyCode
        );
        return wallet && `${wallet.usableQuota}${wallet.currencyCode}`;
      }
      return 0;
    }
    return 0;
  }
  return 0;
});

const walletModalFormRef = ref();

const showWalletModal = (type, record) => {
  walletModalConfig.title = type === "RECHARGE" ? "打款" : "转出";
  walletModalConfig.formState.walletId = null;
  walletModalConfig.formState.account = null;
  walletModalConfig.formState.remark = null;
  walletModalConfig.record = record;
  walletModalConfig.show = true;
};

const onWalletModalOk = async () => {
  const formValues = await walletModalFormRef.value.validate();
  (formValues.targetUserId = walletModalConfig.record.id),
    (formValues.channel =
      walletModalConfig.title === "打款" ? "RECHARGE" : "ROLLOFF");
  await walletApis.rechargeAmount(formValues);
  message.success(`${walletModalConfig.title}成功`);
  walletModalConfig.show = false;
  fetchUsers();
};

const checkAmount = async (_rule, value) => {
  if (!value) {
    return Promise.reject("请输入金额");
  }
  if (value < 0.01) {
    return Promise.reject("金额最小为0.01");
  }
  return Promise.resolve();
};

const configModalConfig = reactive({
  show: false,
  title: "配置管理",
  dataSource: [],
});

const updateConfig = async (record) => {
  await userCardApis.updateUserCardWallet(record);
  message.success("更新成功");
};

// 配置管理
const showConfigModal = async (record) => {
  const res = await userCardApis.listUserCardWallet({
    targetUserId: record.id,
  });
  configModalConfig.dataSource = res;
  configModalConfig.show = true;
};

// 冻结
const updateStatus = async (record) => {
  Modal.confirm({
    title: () => "提示",
    content: () => `是否将该账号${record.status === 0 ? "冻结" : "解冻"}？`,
    async onOk() {
      await userApis.updateStatus({
        targetId: record.id,
        status: record.status === 0 ? 1 : 0,
      });
      message.success(`${record.status === 0 ? "冻结" : "解冻"}成功`);
      fetchUsers();
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCancel() {},
  });
};
</script>
<style lang="less" scoped></style>
