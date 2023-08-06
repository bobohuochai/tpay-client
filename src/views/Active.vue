<template>
  <div class="login">
    <a-spin :spinning="true"></a-spin>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import * as userApis from "../services/user";
import { message } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
const { code } = route.query;

const init = async () => {
  const data = await userApis.active({ code });
  if (data) {
    router.push('/login')
    message.success("激活成功，请登录")
  }
};

init()
</script>
<style lang="less" scoped>
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #f0f2f5 url(../assets/login-bg.svg) no-repeat 50%;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
