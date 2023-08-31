<template>
    <div class="balance-wrap pt-48px  px-16px">
        <span class="text-16px font-600">多币种钱包</span>
        <ul>
            <li v-for="item in wallets" :key="item.id" class="px-16px py-6px bg-#fff flex items-center justify-between">
                <img class="h-24px w-24px" :src="currencyFile(`/src/assets/currency/${item.currencyCode}.svg`)" alt="" />
                <div class="flex items-center">
                    <span class="text-16px font-500 color-#2C261B mr-12px">{{ item.usableQuota }}</span>
                    <span class="text-12px font-400 color-#2C261B">{{ item.currencyCode }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useFile } from '../hooks/useFile'
import { computed } from 'vue'
const userStore = useUserStore();
const wallets = computed(() => {
    return userStore.wallets
})

const currencyFile = (imgFile) => {
    return useFile(imgFile)
}

</script>

<style lang="less" scoped>
ul {
    margin: 0px;
    margin-block: 0px;
    padding: 0px;
}

ul li {
    margin-bottom: 12px
}

ul li:first-child {
    margin-top: 12px
}

ul li:last-child {
    margin-bottom: 0px;
}

.balance-wrap {
    position: fixed;
    bottom: 36px;
    left: 0px;
    width: 200px;
    border-top: 1px solid rgba(44, 38, 27, 0.04);
    background: transparent;
    background-color: #f6f6f6;
}
</style>