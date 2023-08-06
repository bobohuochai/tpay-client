import HomeView from "../views/HomeView.vue";
import AccountList from "../views/AccountList.vue";
import RechargeOrder from "../views/RechargeOrder.vue";
import RechargeList from "../views/RechargeList.vue";

import CardRequest from "../views/CardRequest.vue";
import CardList from "../views/CardList.vue";
import TransactionDetail from "../views/TransactionDetail.vue";
import WalletDetailList from "../views/WalletDetailList.vue";
import UpdatePayPassword from "../views/UpdatePayPassword.vue";
import BatchOperate from "../views/BatchOperate.vue";
import UpdatePassword from "../views/UpdatePassword.vue";
import UpdateLoginPassword from "../views/UpdateLoginPassword.vue";

import ComptrolList from "../views/ComptrolList.vue";
import Cardholder from "../views/Cardholder.vue";
import KYC from "../views/KYC.vue";
export const moduleRoutes = [
  {
    path: "/home",
    name: "HomeIndex",
    component: HomeView,
    meta: {
      auth: true,
      title: "首页",
    },
  },
  {
    path: "/account-list",
    name: "AccountList",
    component: AccountList,
    meta: {
      auth: true,
      title: "账户列表",
    },
  },
  {
    path: "/recharge-order",
    name: "RechargeOrder",
    component: RechargeOrder,
    meta: {
      auth: true,
      title: "账户充值",
    },
  },
  {
    path: "/recharge-list",
    name: "RechargeList",
    component: RechargeList,
    meta: {
      auth: true,
      title: "充值订单",
    },
  },
  {
    path: "/kyc",
    name: "KYC",
    component: KYC,
    meta: {
      auth: true,
      title: "认证资料",
    },
  },
  {
    path: "/card-request",
    name: "CardRequest",
    component: CardRequest,
    meta: {
      auth: true,
      title: "申请卡",
    },
  },
  {
    path: "/cardholder",
    name: "Cardholder",
    component: Cardholder,
    meta: {
      auth: true,
      title: "持卡人"
    },
  },
  {
    path: "/card-list",
    name: "CardList",
    component: CardList,
    meta: {
      auth: true,
      title: "卡列表"
    },
  },
  {
    path: "/transaction-detail",
    name: "TransactionDetail",
    component: TransactionDetail,
    meta: {
      auth: true,
      title: "交易详情"
    },
  },
  {
    path: "/wallet-detail-list",
    name: "WalletDetailList",
    component: WalletDetailList,
    meta: {
      auth: true,
      title: "账户明细"
    },
  },
  {
    path: "/update-pay-password",
    name: "UpdatePayPassword",
    component: UpdatePayPassword,
    meta: {
      auth: true,
      title: "支付密码"
    },
  },
  {
    path: "/update-login-password",
    name: "UpdateLoginPassword",
    component: UpdateLoginPassword,
    meta: {
      auth: true,
      title: "登录密码"
    },
  },
  {
    path: "/batch-operate",
    name: "BatchOperate",
    component: BatchOperate,
    meta: {
      auth: true,
      title: "批量操作",
    },
  },
  {
    path: "/update-password",
    name: "UpdatePassword",
    component: UpdatePassword,
    meta: {
      auth: true,
      title: "修改密码",
      keepAlive: true,
    },
  },
  // {
  //   path: "/comptrol-list",
  //   name: "ComptrolList",
  //   component: ComptrolList,
  //   meta: {
  //     auth: true,
  //     title: "审计",
  //     keepAlive: true,
  //   },
  // },
];
