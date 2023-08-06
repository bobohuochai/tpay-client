import axios from "axios";
import { message } from "ant-design-vue";
import { Modal } from "ant-design-vue";

const instance = axios.create({
  // baseURL: 'http://localhost:9569/',
  // baseURL: 'http://127.0.0.1:4523/m1/2102699-0-default/',
  baseURL: import.meta.env.DEV ? "/api/" : "/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleBusinessError = async (data) => {
  if (data.status === 401) {
    const from = encodeURIComponent(window.location.href);
    window.location.replace(`/#/login?from=${from}`);
  } else {
    // https://github.com/axios/axios/issues/3779
    // 导出文件请求报错
    const isJsonBlob = (data) => data instanceof Blob && data.type === "application/json";
    const responseData = isJsonBlob(data) ? await data.text() : data ;
    const responseJson = (typeof responseData === "string") ? JSON.parse(responseData) : responseData;
    message.error(responseJson.message || "未知错误");
  }
};

const loginSuccess = (response) => {
  window.localStorage.setItem("nailToken", response.headers.token);
};

instance.interceptors.request.use(
  function (config) {
    if (config.url !== "/vccuser/login") {
      config.headers.Authorization =
        window.localStorage.getItem("nailToken") || "";
    }
    // config.headers.Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI3WXJ0WnJ1S0NvRk1KZmFDVGtUTEZ3PT0iLCJleHBhbmQiOiJyZ002a1lkaFp1Ym5wRHFEdFo0V0p3PT0iLCJleHAiOjE2NzI2NDM1NTEsIm5iZiI6MTY3MjAzODc1MX0.TByVivAfvO1DQjelEg1o_vQyZhY39fdt5srT--L2X7o';
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.headers["content-type"] === "application/octet-stream") {
      return response;
    }

    const { data } = response;
    if (response.config.baseURL.includes("127.0.0.1")) {
      // mock接口则直接返回
      return data.data || data;
    }
    if (parseInt(data.status, 10) !== 200) {
      if (response.config.url === "/vccuser/login" && data.status === 201) {
        Modal.info({
          title: data.message,
          content: "已发送邮件，请通过邮件链接激活后登录",
          onOk() {},
        });
      } else {
        handleBusinessError(data);
      }
      return Promise.reject(data);
    } else {
      if (response.config.url === "/vccuser/login") {
        loginSuccess(response);
        return data;
      }
      return data.data;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
