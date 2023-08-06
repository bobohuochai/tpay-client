import { createApp } from "vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import Vue3SeamlessScroll from "vue3-seamless-scroll";
import "ant-design-vue/dist/antd.css";

import App from "./App.vue";
import router from "./router";
import { createRouterGuard } from "./router/permission";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());


app.use(router);
createRouterGuard(router);
router.isReady();

app.use(Antd);
app.use(Vue3SeamlessScroll);

app.mount("#app");
