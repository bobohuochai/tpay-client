<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    title: ''
})

</script>
<template>
    <div class="pa-24px bg-#fff">
        <span class="c-#2C261B font-600 text-16px leading-none title">{{ title }}</span>
        <slot></slot>
    </div>
</template>
<style lang="less" scoped>
div {
    position: relative;
}

span.title::before {
    width: 4px;
    height: 14px;
    border-radius: 4px;
    background: #2C261B;
    content: '';
    display: block;
    position: absolute;
    left: 0px;
    top: 29px;
}
</style>