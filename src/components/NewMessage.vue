<template>
    <div class="message-box py-8px pl-24px mx-24px" v-if="visible">
        <img class="w-24px h-24px mr-16px" src="../assets/notice.png" />
        <span>{{ message.content }}</span>
        <div class="flex flex-grow-1"></div>
        <img class="w-18px h-18px mr-12px cursor-pointer" src="../assets/close-message.png" @click="handleClose" />
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { getNewMessageApi } from '../services/newMessage'

const message = ref({ content: '为更好的服务客户，系统正在加紧升级中，07.30号恢复正常，敬请期待！' })
const visible = ref(true)

const handleClose = () => {
    visible.value = false
}

onBeforeMount(async () => {
    const resp = await getNewMessageApi()
    console.log('resp.data===>', resp.data)
    message.value = resp.data
})

</script>

<style lang="less" scoped>
.message-box {
    border-radius: 6px;
    border: 1px solid #F9D796;
    background: linear-gradient(0deg, rgba(221, 177, 99, 0.08)) 0%, rgba(221, 177, 99, 0.08) 100%, #FFF;
    height: 40px;
    display: flex;
    align-items: center;
    background: linear-gradient(0deg, rgba(221, 177, 99, 0.08) 0%, rgba(221, 177, 99, 0.08) 100%), #FFF;
    margin-top: 16px;

    span {
        color: #2C261B;
        font-family: PingFang SC;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%;
        opacity: 0.7;

    }
}
</style>