<template>
    <div class="balance-wrap">
        <ul class="flex">
            <li v-for="item in wallets" :key="item.id" :style="backgroundImg(item)" class="flex flex-col justify-between">
                <div class="amount flex flex-col">
                    <label>可用余额</label>
                    <span class="font-500 text-32px leading-none ">{{ item.usableQuota }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="c-#2C261B text-14px font-400">{{ item.currencyCode }}</span>
                    <img class="h-30px w-30px" :src="currencyFile(`/src/assets/currency/${item.currencyCode}.png`)"
                        alt="" />
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

const backgroundImg = (item) => {
    if (item) {
        const fileUrl = currencyFile(`/src/assets/home/${item.currencyCode}-BG.png`)
        return {
            backgroundImage: `url(${fileUrl})`
        }
    }
}


</script>

<style lang="less" scoped>
ul {
    margin: 0px;
    margin-block: 0px;
    padding: 0px;
    list-style-type: none;
    color: #2C261B;
}

ul li {
    border-radius: 6px;
    width: 246px;
    height: 152px;
    flex-shrink: 0;
    margin-right: 32px;
    padding-left: 24px;
    padding-top: 20px;
    padding-bottom: 8px;
    padding-right: 8px;
}

ul li:last-child {
    margin-right: 0px;
}
</style>