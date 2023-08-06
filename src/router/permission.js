import { getToken, removeToken, setToken } from "../helpers/utils";
import { useUserStore } from "../stores/user";
import { useTabStore } from "../stores/tab";

/** 处理路由页面的权限 */
export async function createPermissionGuard(to, from, next) {
  const authStore = useUserStore();
  const tabStore = useTabStore();
  let isLogin = false;
  if (authStore.first) {
    const token = getToken();
    if (token) {
      await authStore.getUserInfo();
      authStore.createSse()
      isLogin = Boolean(authStore.isLogin);
    }
  }

  isLogin = authStore.isLogin;

  const needLogin = Boolean(to.meta?.auth);

  if (needLogin && isLogin && authStore.userInfo.initPayPassword === false && to.path !== '/pay-password') {
    next({ name: "SetPayPassword" });
  }
  if (isLogin && needLogin) {
    next();
    tabStore.push(to);
  } else if (isLogin && !needLogin) {
    next({ name: "Root" });
  } else if (!isLogin && needLogin) {
    next({ name: "Login", query: { form: to.fullPath } });
  } else {
    if (!needLogin) {
      removeToken();
    }
    next();
  }
}

export async function createRoGuard(to, from, next) {
  if (to.name === "HomeIndex" && to.query.ro && to.query.nailToken) {
    setToken(to.query.nailToken);
  }
}

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router) {
  router.beforeEach(async (to, from, next) => {
    await createRoGuard(to, from, next);
    // 页面跳转权限处理
    await createPermissionGuard(to, from, next);
  });
}
