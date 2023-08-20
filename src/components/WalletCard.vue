<template>
    <div class="balance-wrap">
        <ul class="flex">
            <li v-for="(item, $index) in wallets" :key="item.id" :style="backgroundImg(item)"
                class="flex flex-col justify-between">
                <div class="amount flex flex-col">
                    <label>可用余额</label>
                    <span class="font-500 text-32px leading-none ">{{ item.usableQuota }}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="c-#2C261B text-14px font-400">{{ item.currencyCode }}</span>
                    <img class="h-30px w-30px" :src="currencyFile(`/src/assets/currency/${item.currencyCode}.png`)"
                        alt="" />
                </div>
                <img v-if="item.currencyCode === 'USD'" src="../assets/home/arrow-right.png" @click="goto(item)"
                    class="jump-img w-30px h-20px bg-cover" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useUserStore } from "../stores/user";
import { useFile } from '../hooks/useFile'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore();
const router = useRouter()

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
            backgroundImage: `url(${fileUrl})`,
            backgroundSize: 'cover'
        }
    }
}

const goto = (item) => {
    router.push({ name: 'RechargeOrder', query: { currency: item.currencyCode } })

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
    position: relative;
}

ul li:last-child {
    margin-right: 0px;
}

.jump-img {
    position: absolute;
    top: 20px;
    right: 12px;
    cursor: pointer;
}
</style>