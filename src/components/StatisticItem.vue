<template>
    <div class="flex flex-col mr-16px">
        <span class="text-12px font-600 leading-none mb-16px">{{ titleMap[type] }}</span>
        <label class="text-12px font-400 leading-none text-opacity-70 mb-8px">金额 <span :class='["text-18px", "font-500"
            , "leading-none", "pl-8px", type]'>{{ data?.amount
    }} &nbsp;USD</span>
        </label>

        <label class="text-12px font-400 leading-none text-opacity-70">笔数<span
                class="text-18px font-500 leading-none c-#DDB163 pl-8px">{{
                    data?.count }}</span></label>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    type: '',
    data: {}
})

const titleMap = {
    "success": '交易成功',
    "failure": '交易失败',
    "refund": "交易退款"
}
</script>

<style>
.success {
    color: #DDB163
}

.failure {
    color: #F65050
}

.refund {
    color: #2C261B
}
</style>

