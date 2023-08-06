import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Active from "../views/Active.vue";
import Forgot from "../views/Forgot.vue";
import SetPayPassword from "../views/UpdatePayPassword.vue";
import {moduleRoutes} from "./modules";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        auth: false,
      },
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        auth: false,
      },
    },
    {
      path: "/register/:referralCode",
      name: "Referral",
      component: Register,
      meta: {
        auth: false,
      },
    },
    {
      path: "/active",
      name: "Active",
      component: Active,
      meta: {
        auth: false,
      },
    },
    {
      path: "/forgot",
      name: "Forgot",
      component: Forgot,
      meta: {
        auth: false,
      },
    },
    {
      path: "/",
      name: "Root",
      redirect: "home",
    },
    {
      path: "/pay-password",
      name: 'SetPayPassword',
      component: SetPayPassword,
      meta: {
        auth: true
      }
    },
    ...moduleRoutes,
  ],
});

export default router;
