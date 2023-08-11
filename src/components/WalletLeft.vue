<template>
    <a-spin class="wallet_container" :spinning="isLoading">
        <ul class="wallet_wrapper">
            <li v-for="item in walletList" :key="item.id" class="wallet_wrapper-item">
                <p class="title">{{ item.currencyCode }}</p>
                <p class="content">可用余额：{{ item.usableQuota }} {{ item.currencyCode }}</p>
            </li>
        </ul>
    </a-spin>
</template>

<script setup>
import { ref } from 'vue'
import * as userApis from "../services/user";
import { useAsyncState } from "@vueuse/core";
import { watch } from "vue";

const { state, isLoading } = useAsyncState(() =>
    userApis.get()
);

let walletList = ref({
    currencyCode: 'USD',
    usableQuota: 0
});

watch(state, (value) => {
    walletList.value = value.walletVos;
})

</script>

<style scoped>
.wallet_wrapper {
    display: flex;
    padding: 0;
}

.wallet_wrapper-item {
    margin: 20px 5px;
    padding: 15px;
    border: 1px solid #f7eded;
    list-style: none;
}

.wallet_wrapper-item .title {
    color: #958c8c;
    font-size: 32px;
    font-weight: 700;
    margin: 0;
}

.wallet_wrapper-item .content {
    color: #958c8c;
    margin: 5px 0;
}
</style>
