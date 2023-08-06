<template>
  <div class="notice-bar" v-if="notices && notices.length">
    <div>公告：</div>
    <div style="width: 600px">
      <a-carousel autoplay class="carousel">
        <div class="item" v-for="(item, index) in notices" :key="index">
          <span>{{ item.content }}</span>
        </div>
      </a-carousel>
    </div>
    <!-- <vue3-seamless-scroll
      :list="notices"
      direction="up"
      class="scroll"
      :step="0.3"
    >
      <div class="item" v-for="(item, index) in notices" :key="index">
        <span>{{ item.content }}</span>
      </div>
    </vue3-seamless-scroll> -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import * as noticeApis from "../services/notice";

let notices = ref([]);

const fetchNotices = async () => {
  const noticesRes = await noticeApis.paging({});
  notices.value = noticesRes.records || [];
};

onMounted(async () => {
  fetchNotices();
});
</script>
<style lang="less" scoped>
.notice-bar {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
}
.carousel {
  width: 100%;
  height: 30px;
  font-size: 18px;
  font-weight: 700;
  .item{
    line-height: 30px;
  }
}
</style>
