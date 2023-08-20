<template>
    <div>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="30" height="27" viewBox="0 0 30 27" fill="none">
            <path d="M30 0V27H0L30 0Z" fill="#F65050" />
        </svg> -->
        <check-outlined class="c-#fff img"></check-outlined>
    </div>
</template>

<script setup>
import { CheckOutlined } from '@ant-design/icons-vue'
</script>

<style scoped lang="less">
div {
    position: relative;
    width: 0;
    height: 0;
    border-bottom: 30px solid #F65050;
    border-left: 27px solid transparent;
    border-bottom-right-radius: 6px;

    .img {
        position: absolute;
        bottom: -28px;
        right: 2px;
    }
}
</style>

