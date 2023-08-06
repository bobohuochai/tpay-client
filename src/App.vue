<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { RouterView, useRoute } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import MainLayout from "@/components/MainLayout.vue";
import OtherLayout from "@/components/OtherLayout.vue";
import { useUserStore } from './stores/user';
import { notification } from "ant-design-vue";
dayjs.locale("zh-cn");

const locale = ref(zhCN);
const includeList = ref([]);
const route = useRoute();

// const router = useRouter()
watch(
    () => route,
    (newVal, oldVal) => {
        if (newVal.meta.keepAlive && !includeList.value.includes(newVal.name)) {
            includeList.value.push(newVal.name);
        }
    },
    { deep: true }
); // 开启深度监听
const userStore = useUserStore();

watch(
    () => userStore.wallets,
    (newWallets) => {
        const useableAmountLessZeroWallet = newWallets.find(wallet => wallet.usableQuota < 0)
        if (useableAmountLessZeroWallet) {
            notification.warning({ description: `当前币种${useableAmountLessZeroWallet.currencyCode}钱包余额不足，请尽快充值。`, message: '余额不足' })
        }
    },
    { immediate: true }
)

const isRouterAlive = ref(true);

const reload = async () => {
    isRouterAlive.value = false;
    await nextTick();
    isRouterAlive.value = true;
};
</script> 

<template>
    <a-config-provider :locale="locale">
        <div v-if="$route.path === '/pay-password'" class="min-h-full">
            <other-layout :reload="reload">
                <RouterView v-slot="{ Component }"></RouterView>
            </other-layout>
        </div>
        <main-layout v-else-if="$route.meta.auth" :reload="reload">
            <RouterView v-slot="{ Component }">
                <KeepAlive :include="includeList">
                    <component :is="Component" :key="$route.name" v-if="isRouterAlive"></component>
                </KeepAlive>
            </RouterView>
        </main-layout>
        <div v-else class="min-h-full">
            <RouterView></RouterView>
        </div>
    </a-config-provider>
</template>

<style scoped></style>
