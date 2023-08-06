<template>
  <main>
    <a-spin :spinning="isLoading">
      <WalletLeft></WalletLeft>
      <div style="display: flex;">
        <a-card style="margin-bottom: 20px;flex:1;margin: 0 5px;">
          <div style="height: 300px; width: 100%" ref="openCardCountRef"></div>
        </a-card>
        <a-card style="margin-bottom: 20px;flex:1;margin: 0 5px;">
          <div
            style="height: 300px; width: 100%"
            ref="successAmountCountRef"
          ></div>
        </a-card>
      </div>
      <div style="display: flex;margin-top: 10px;">
        <a-card style="margin-bottom: 20px;flex:1;margin: 0 5px;">
          <div style="height: 300px; width: 100%" ref="successRateCountRef"></div>
        </a-card>
        <a-card style="flex:1;margin: 0 5px;">
          <div
            style="height: 300px; width: 100%"
            ref="successTransCountRef"
          ></div>
        </a-card>
      </div>
    </a-spin>
  </main>
</template>

<script setup>
import { ref, watchEffect, onMounted, watch } from "vue";
import { useAsyncState } from "@vueuse/core";
import * as statisticsApi from "../services/statistics";
import WalletLeft from "../components/WalletLeft.vue";
import * as echarts from "echarts";
const params = ref({
  targetUserId: undefined,
});

const { state, isLoading } = useAsyncState(() =>
  statisticsApi.get(params.value)
);

const openCardCountRef = ref();
const openCardCountChart = ref();
const successAmountCountRef = ref();
const successAmountCountChart = ref();
const successRateCountRef = ref();
const successRateCountChart = ref();
const successTransCountRef = ref();
const successTransCountChart = ref();

onMounted(() => {
  openCardCountChart.value = echarts.init(openCardCountRef.value);
  successAmountCountChart.value = echarts.init(successAmountCountRef.value);
  successRateCountChart.value = echarts.init(successRateCountRef.value);
  successTransCountChart.value = echarts.init(successTransCountRef.value);
});

watch(
  () => state.value,
  (n) => {
    openCardCountChart.value?.setOption({
      title: {
        show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
        text: "近一个月的开卡数", //主
      },
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: n?.openCardCount.map((it) => it.date).reverse() ?? [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: n?.openCardCount.map((it) => Number(it.count)).reverse() ?? [],
          type: "line",
        },
      ],
    });
    successAmountCountChart.value?.setOption({
      title: {
        show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
        text: "近一个月成功交易数", //主
      },
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: n?.successAmountCount.map((it) => it.date).reverse() ?? [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data:
            n?.successAmountCount.map((it) => Number(it.amount)).reverse() ??
            [],
          type: "line",
        },
      ],
    });
    successRateCountChart.value?.setOption({
      title: {
        show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
        text: "近一个月的成功交易金额", //主
      },
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: n?.successRateCount.map((it) => it.date).reverse() ?? [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data:
            n?.successRateCount.map((it) => Number(it.rate)).reverse() ?? [],
          type: "line",
        },
      ],
    });
    successTransCountChart.value?.setOption({
      title: {
        show: true, //显示策略，默认值true,可选为：true（显示） | false（隐藏）
        text: "近一个月的成功交易率", //主
      },
      tooltip: {
        trigger: "item",
      },
      xAxis: {
        type: "category",
        data: n?.successTransCount.map((it) => it.date).reverse() ?? [],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data:
            n?.successTransCount.map((it) => Number(it.count)).reverse() ?? [],
          type: "line",
        },
      ],
    });
  },
  { immediate: true }
);
</script>
