<template>
    <a-layout>
        <a-layout-header class="header px-24px!" :style="{ position: 'fixed', zIndex: 100, width: '100%' }">
            <logo />
            <div class="header-content">
                <notice-bar />
            </div>
            <a-dropdown class="username">
                <a @click.prevent><span id="user-id-handler">用户ID：{{ userStore.userInfo.id }}</span></a>
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
        <a-layout has-sider>
            <a-layout-sider width="200" class="sider-wrap"
                :style="{ overflow: 'auto', position: 'fixed', left: 0, top: '64px', bottom: 0 }">
                <a-menu class="menu-wrap" mode="inline" :style="{ height: '100%', borderRight: 0, background: '#f7f6f6' }"
                    v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" @select="onSelect">
                    <template v-for="sm in menus" :key="sm.key">
                        <a-sub-menu v-if="sm.children" :key="sm.key">
                            <template #title>
                                <img class="mr-12px w-20px h-20px " v-if="isActive(sm.key)"
                                    :src="menuIcon(`/src/assets/menus/${sm.activeIcon}.png`)" alt="" />
                                <img class="mr-12px w-20px h-20px" v-if="!isActive(sm.key)"
                                    :src="menuIcon(`/src/assets/menus/${sm.icon}.png`)" alt="" />
                                <span>{{ sm.name }}</span>
                            </template>
                            <a-menu-item class="flex items-center" v-for="m in sm.children" :key="m.key">
                                <span :id="m.key">{{ m.name }}</span>
                            </a-menu-item>
                        </a-sub-menu>
                        <template v-else>
                            <a-menu-item class="flex items-center" :key="sm.key">
                                <img class="mr-12px w-20px h-20px" v-if="isActive(sm.key)"
                                    :src="menuIcon(`/src/assets/menus/${sm.activeIcon}.png`)" alt="" />
                                <img class="mr-12px  w-20px h-20px" v-if="!isActive(sm.key)"
                                    :src="menuIcon(`/src/assets/menus/${sm.icon}.png`)" alt="" />
                                <span :id="sm.key">{{ sm.name }}</span>
                            </a-menu-item>

                        </template>
                    </template>
                </a-menu>
                <wallet-balance></wallet-balance>
            </a-layout-sider>
            <a-layout class="bg-#f7f6f6 content-wrap" :style="{ marginLeft: '200px', marginTop: '64px', }">
                <!-- <div class="tabs-box">
                    <div ref="bsWrapper" class="bs-wrapper">
                        <better-scroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: canClick }">
                            <div class="tabs">
                                <a-tag v-for="tab in tabStore.tabs" :key="tab.name" closable
                                    :color="tabStore.active === tab.name ? 'blue' : undefined" @click="to(tab)"
                                    @close="tabStore.remove(tab.name)">{{ tab.title }}
                                </a-tag>
                            </div>
                        </better-scroll>
                    </div>
                </div> -->
                <div style="padding: 0 24px 24px">
                    <a-breadcrumb style="margin: 16px 0">
                        <a-breadcrumb-item v-for=" b  in  breads ">{{ b }}</a-breadcrumb-item>
                    </a-breadcrumb>
                    <a-layout-content :style="{
                        background: '#fff',
                        padding: '24px',
                        margin: 0,
                        minHeight: '280px',
                    }
                        ">
                        <slot></slot>
                    </a-layout-content>
                </div>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script>
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { useTabStore } from "../stores/tab";
import logoJpg from "../assets/logo.jpeg";
import NoticeBar from "../components/NoticeBar.vue";
import BetterScroll from "./BetterScroll.vue";
import { useDeviceInfo } from "../helpers/utils";
import { moduleRoutes } from "../router/modules";
import { useFile } from "../hooks/useFile";
import WalletBalance from '../components/WalletBalance.vue';
import Logo from './logo.vue'


import driver from '../driver/index';

export default defineComponent({
    props: {
        reload: {
            type: Object,
        },
    },
    components: {
        NoticeBar,
        BetterScroll,
        WalletBalance,
        Logo
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
            router,
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
                    icon: 'home-default',
                    activeIcon: "home"
                },
                {
                    name: "账户管理",
                    key: "recharge",
                    icon: 'account-manage-default',
                    activeIcon: 'account-manage',
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
                    key: "card",
                    activeIcon: 'cards-manage',
                    icon: 'cards-manage-default',
                    children: [
                        {
                            name: "申请开卡",
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
                    key: 'transaction-detail',
                    icon: 'trans-default',
                    activeIcon: 'trans'
                },
                {
                    name: "账户明细",
                    key: "wallet-detail-list",
                    icon: "wallet-detail-default",
                    activeIcon: "wallet-detail"
                },
                {
                    name: "支付设置",
                    key: "update",
                    icon: 'pay-settings-default',
                    activeIcon: 'pay-settings',
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
            breads: ref([])
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
        onSelect(item) {
            this.router.push(item.key);
        },
        menuIcon(url) {
            return useFile(url)
        },
        isActive(key) {
            return this.selectedKeys.findIndex(s => s.includes(key)) > -1
        },
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
            } catch (e) {
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
        const userStore = useUserStore();

        if (typeof userStore.isNewCustom !== undefined && userStore.isNewCustom === true) {
            driver();
        }

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
.content-wrap {
    min-height: calc(100vh - 64px);
    width: calc(100vw - 200px) !important;
    flex-grow: 0;
}

.sider-wrap {
    height: calc(100vh - 64px)
}

.menu-wrap {
    max-height: calc(100vh - 64px - 204px - 48px);
    overflow-y: auto;
    padding-bottom: 28px;
}



::v-deep .ant-layout-sider {
    background: #f7f6f6;
}

::v-deep .ant-menu-sub.ant-menu-inline {
    background: #f7f6f6;
}

::v-deep .ant-menu-title-content {
    display: flex;
    align-items: center;
}

::v-deep .ant-menu-inline .ant-menu-item::before {
    position: absolute;
    top: 0;
    left: 4px;
    bottom: 0;
    border-left: 4px solid #F9D796;
    border-radius: 4px;
    transform: scaleY(0.0001);
    opacity: 0;
    transition: transform 0.15s cubic-bezier(0.215, 0.61, 0.355, 1), opacity 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
    content: '';
}

::v-deep .ant-menu-inline .ant-menu-item::after {
    display: none;
}

::v-deep .ant-menu-inline .ant-menu-selected::before,
::v-deep .ant-menu-inline .ant-menu-item-selected::before {
    transform: scaleY(1);
    opacity: 1;
    transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}


.header {
    display: flex;
    align-items: center;
    background-color: #fff;
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
