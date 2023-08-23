<template>
    <a-progress class="mt-24px home-progress" type="dashboard" :gapDegree="75" :percent="data?.percentage" :width="138"
        :strokeColor="contentMap[type]?.strokeColor" :strokeWidth="16" :trailColor="contentMap[type]?.trailColor">
        <template #format="percent">
            <div class="flex flex-col items-center justify-center">
                <label class="c-#DDB163 text-18px font-600  leading-none pb-4px">{{
                    data?.percentage
                }}
                    <span class="text-10px leading-none v-text-top">%</span></label>
                <span class="c-#2C261B text-12px font-400 leading-none text-opacity-70">{{ contentMap[type]?.text }}
                </span>
            </div>
        </template>
    </a-progress>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    type: '',
    data: {}
})

const contentMap = {
    "success": {
        text: '成功率', strokeColor: '#F9D796', trailColor: "#f9d79680"
    },
    "refund": { text: '退款率', strokeColor: '#2C261B', trailColor: '#2c261b1a' },
    "failure": { text: "失败率", strokeColor: '#2C261B', trailColor: '#2c261b1a' }
}

</script>

<style lang="less" scoped >
.home-progress.ant-progress-circle ::v-deep {
    .ant-progress-text {
        top: 44%
    }
}
</style>

