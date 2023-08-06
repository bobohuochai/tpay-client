<template>
  <a-layout>
    <a-layout-header class="header">
      <img class="logo" :src="logoJpg" height="40" />
      <div class="header-content">
        <notice-bar />
      </div>
      <div class="amount" v-if="userStore.userInfo.roleCode !== 'USER'">
        可用余额：{{ amount }}
      </div>
      <a-dropdown class="username">
        <a @click.prevent>
          {{ userStore.userInfo.username }}
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <router-link to="/kyc">认证信息</router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/update-login-password">修改密码</router-link>
            </a-menu-item>
            <a-menu-item @click="logout"> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-layout-header>
    <a-layout>
      <div style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="b in breads">{{ b }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{
            background: '#fff',
            padding: '12px 24px',
            margin: 0,
            minHeight: '280px',
          }"
        >
          <slot></slot>
        </a-layout-content>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { useTabStore } from "../stores/tab";
import logoJpg from "../assets/logo.jpeg";
import NoticeBar from "./NoticeBar.vue";
import BetterScroll from "./BetterScroll.vue";
import { useDeviceInfo } from "../helpers/utils";
import { moduleRoutes } from "../router/modules";

export default defineComponent({
  props: {
    reload: {
      type: Object,
    },
  },
  components: {
    NoticeBar,
    BetterScroll,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const userStore = useUserStore();
    const tabStore = useTabStore();
    const deviceInfo = useDeviceInfo();
    const selectedKeys = ref([route.path.replace("\/", "")]);

    watchEffect(() => {
      selectedKeys.value = [route.path.replace("\/", "")];
    });
    return {
      route,
      canClick: Boolean(deviceInfo.device.type),
      logoJpg: ref(logoJpg),
      userStore,
      tabStore,
      selectedKeys,
      openKeys: ref([]),
      menus: [
        {
          name: "首页",
          key: "home",
        },
        {
          name: "账户管理",
          key: "账户管理",
          children: [
            {
              name: "账户充值",
              key: "recharge-order",
            },
            {
              name: "充值订单",
              key: "recharge-list"
            }
          ],
        },
        {
          name: "卡片管理",
          key: "卡片管理",
          children: [
            {
              name: "申请卡",
              key: "card-request",
            },
            {
              name: "卡列表",
              key: "card-list",
            },
            {
              name: "持卡人管理",
              key: "cardholder",
            },
          ],
        },
        {
          name: '交易详情',
          key: '交易详情',
          children: [
            {
              name: '交易详情',
              key: 'transaction-detail'
            }
          ]
        },
        {
          name: "资金对账",
          key: "资金对账",
          children: [
            {
              name: "账户明细",
              key: "wallet-detail-list",
            },
          ],
        },
        {
          name: "支付设置",
          key: "支付设置",
          children: [
            {
              name: "支付密码",
              key: "update-pay-password",
            },
            {
              name: "登录密码",
              key: "update-login-password",
            },
          ],
        },
      ],
      breads: ref([]),
      onSelect(item) {
        router.push(item.key);
      },
    };
  },
  computed: {
    amount() {
      const waArr = [];
      this.userStore.wallets.map((wa) => {
        waArr.push(`${wa.usableQuota}${wa.currencyCode}`);
      });
      return waArr.join("，");
    },
  },
  watch: {
    $route: {
      handler() {
        this.setBreads();
      },
      immediate: true,
    },
  },
  methods: {
    to(tab) {
      const r = moduleRoutes.find((it) => it.name === tab.name);
      if (this.route.name === tab.name) {
        if (r.meta && r.meta.keepAlive) {
          this.$router.push({ name: tab.name });
        } else {
          this.reload();
        }
      } else {
        this.$router.push({ name: tab.name });
      }
    },
    async logout() {
      try {
        await this.userStore.closeSse();
        window.localStorage.removeItem("nailToken");
        window.location.href = "/";
      } catch(e) {
        window.location.href = "/";
      }
    },
    setBreads() {
      const path = this.$route.path.replace("\/", "");
      const breads = [];
      const pushBreads = (menus) => {
        for (let i = 0; i < menus.length; i++) {
          const me = menus[i];
          if (me.key === path) {
            breads.push(me.name);
            return me.name;
          } else if (me.children) {
            const parentName = pushBreads(me.children);
            if (parentName) {
              breads.unshift(me.name);
              return parentName;
            }
          }
        }
      };
      pushBreads(this.menus);
      this.breads = breads;
    },
  },
  async mounted() {
    let openKeys = [];
    this.menus.map((m) => {
      if (m.children) {
        openKeys.push(m.key);
      }
    });
    this.openKeys = openKeys;
    // this.setBreads();
  },
});
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  background-color: #fff;
  gap: 24px;
  flex-shrink: 0;
  border-bottom: 1px solid #f0f0f0;
  .header-content {
    flex: 1;
    margin-left: 100px;
  }
}

.tabs-box {
  padding: 0 24px;
  background-color: #fff;
  border-left: 1px solid #f0f0f0;
  flex-shrink: 0;
  // top: 0;
  // position: sticky;
  // z-index: 10;

  .tabs {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  :deep(.ant-tag) {
    height: 32px;
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    .ant-tag-close-icon {
      font-size: 14px;
    }
  }
}

.bs-wrapper {
  overflow: hidden;
  height: 48px;
}
.amount {
  font-size: 16px;
  font-weight: bold;
}
</style>
