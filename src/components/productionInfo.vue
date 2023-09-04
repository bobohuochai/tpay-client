<template>
    <ul>
        <li v-for="service in services" :key="service.title">
            <span class="c-#DDB163 font-600 text-18px mb-16px leading-none">{{ service.title }}</span>
            <p class="c-#000 font-400 text-14px leading-normal" v-html="service.content"></p>
        </li>
    </ul>
</template>

<script setup>
const services = [{
    title: "海外IP地址",
    content: "提供北美、欧盟、东南亚等IP地址。</br>适用于跨境店铺申请，海外SAAS服务申请，海外采购等"
}, {
    title: "电商测评服务",
    content: "提供亚马逊、Aliexpress等电商平台测评服务"
}, {
    title: "独立站服务",
    content: "提供独立站成功率管控服务</br>提供fb海外个人号服务"
}]
</script>

<style scoped lang="less">
ul {
    margin: 0px;
    margin-block: 0px;
    padding: 0px;
    list-style-type: none;
    color: #2C261B;
    display: flex;
}

ul li {
    display: flex;
    flex-basis: 33%;
    padding: 24px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    border-radius: 3px;
    background: rgba(44, 38, 27, 0.04);
    margin-right: 24px;
}

ul li:first-child {
    width: 397px;
}

ul li:last-child {
    margin-right: 0px;
}
</style>