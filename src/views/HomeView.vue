<template>
    <div class="main">
        <a-spin :spinning="loading">
            <CardView title="多币种钱包">
                <WalletCard class="pt-24px"></WalletCard>
            </CardView>

            <div class="mt-16px flex">
                <CardView title="近一个月数据分析" class="mr-16px w-564px flex-grow-0">
                    <div class="cards-amount c-#2C261B text-14px font-400 text-opacity-70"><span>卡片总数</span> <span>{{
                        dashboard?.userCard?.sumCount }}</span>张</div>
                    <div class="mt-36px flex ">
                        <StatisticItem :data="dashboard?.success" type="success"></StatisticItem>
                        <StatisticItem :data="dashboard?.failure" type="failure"></StatisticItem>
                        <StatisticItem :data="dashboard?.refund" type="refund"></StatisticItem>
                    </div>
                </CardView>
                <CardView title="关键指标" class="flex-grow-1 pb-0px">
                    <div class="flex">
                        <DashboardProgress class="mr-16px px-12px" type="success" :data="dashboard?.success">
                        </DashboardProgress>
                        <DashboardProgress class="mr-16px px-12px" type="failure" :data="dashboard?.failure">
                        </DashboardProgress>
                        <DashboardProgress class="mr-16px px-12px" type="refund" :data="dashboard?.refund">
                        </DashboardProgress>
                    </div>
                </CardView>
            </div>

            <CardView title="信用卡介绍" class="mt-16px">
                <a-table class="mt-32px" bordered :pagination="false" :dataSource="cardList" :columns="cardListColumns" />
            </CardView>

            <CardView title="产品及服务介绍" class="mt-16px">
                <ProductInfo class="mt-24px!" />
            </CardView>


        </a-spin>
    </div>
</template>

<script setup>
import { ref, watchEffect, onMounted, watch, onBeforeMount } from "vue";
import { useAsyncState } from "@vueuse/core";
import { getApi, cardListApi, dashboardApi } from "../services/statistics";
import WalletCard from "../components/WalletCard.vue";
import CardView from "../components/CardView.vue"
import ProductInfo from '../components/productionInfo.vue'
import StatisticItem from '../components/StatisticItem.vue'
import DashboardProgress from '../components/DashboardProgress.vue'
const loading = ref(true)
const cardList = ref([])


const cardListColumns = [{
    dataIndex: 'sectionNo',
    title: ''
}, {
    dataIndex: 'region',
    title: '发卡地'
}, {
    dataIndex: 'currency',
    title: '结算币种'
}, {
    dataIndex: 'description',
    title: '适用平台',
}, {
    dataIndex: 'remark',
    title: '其他'
}]
const dashboard = ref(null)

onBeforeMount(async () => {
    loading.value = true
    cardList.value = await cardListApi();
    dashboard.value = await dashboardApi();
    loading.value = false
});



</script>
<style lang="less" scoped>
div.cards-amount {
    position: absolute;
    right: 24px;
    top: 24px;
}

div.main {
    background-color: #f6f6f6;
    margin: -24px;
}

::v-deep table thead tr th {
    border-radius: 3px;
    background: rgba(249, 215, 150, 0.20);
}

::v-deep table tbody tr td {
    border-radius: 3px;
    background: rgba(249, 215, 150, 0.40);
}
</style>
