import aIns from "./index";

// 创建连接
export const create = (clientId) => {
  return new EventSource(
    `/api/sse/createSseConnect?token=${window.localStorage.getItem(
      "nailToken"
    )}&clientId=${clientId}`
  );
};

// 关闭连接
export const close = (params) => {
  return aIns.get("/sse/closeSseConnect", {
    params: { ...params, token: window.localStorage.getItem("nailToken") },
  });
};
