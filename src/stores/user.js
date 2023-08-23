import { defineStore } from "pinia";
import { removeToken } from "../helpers/utils";
import * as userApis from "../services/user";
import * as sseApis from "../services/sse";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {},
    listByEmail: [],
    first: true,
    sseClient: undefined,
    sseClientId: undefined,
    rateTemplate: {},
  }),
  getters: {
    wallets(state) {
      return state.userInfo.walletVos || [];
    },
    isLogin(state) {
      return Boolean(state.userInfo.id);
    },
    isOpen (state) {
      return state.userInfo.payPasswordSwitch;
    },
    isNewCustom (state) {
      return state.userInfo.isNewCustom;
    }
  },
  actions: {
    async updateOpen (payload) {
      this.userInfo.payPasswordSwitch = payload;
    },
    async getUserInfo() {
      try {
        const res = await userApis.get();
        this.first = false;
        this.userInfo = res;
      } catch (e) {
        removeToken();
        location.href = "/";
      }
    },
    async getUserRateTemplate() {
      try {
        const res = await userApis.getRateTemplate();
        this.rateTemplate = res;
      } catch (e) {
      }
    },
    createSse() {
      if (window.EventSource) {
        // 建立连接
        this.sseClientId = new Date().getTime();
        this.sseClient = sseApis.create(this.sseClientId);

        /**
         * 连接一旦建立，就会触发open事件
         * 另一种写法：sseClient.onopen = function (event) {}
         */
        this.sseClient.addEventListener(
          "open",
          function (e) {
            console.log("建立连接。。。");
          },
          false
        );

        /**
         * 客户端收到服务器发来的数据
         * 另一种写法：sseClient.onmessage = function (event) {}
         */
        this.sseClient.addEventListener("message", (e) => {
          try {
            const result = JSON.parse(e.data);
            if (result.type === "refreshUsableQuota") {
              this.userInfo.walletVos = result.data;
            }
          } catch (e) {}
        });

        /**
         * 如果发生通信错误（比如连接中断），就会触发error事件
         * 或者：
         * 另一种写法：sseClient.onerror = function (event) {}
         */
        this.sseClient.addEventListener(
          "error",
          function (e) {
            if (e.readyState === EventSource.CLOSED) {
              console.log("连接关闭");
            } else {
              console.log(e);
            }
          },
          false
        );
        window.onbeforeunload = function () {
          closeSse();
        };
      } else {
        alert("你的浏览器不支持SSE");
      }
    },
    async closeSse() {
      this.sseClient && this.sseClient.close();
      await sseApis.close({ clientId: this.sseClientId });
    },
    async getListByEmail() {
      const res = await userApis.listByEmail({
        email: this.userInfo.email,
      });
      this.listByEmail = res;
    },
  },
});
