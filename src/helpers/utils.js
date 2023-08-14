import UAParser from "ua-parser-js";

export const downloadFromRes = (res) => {
  const { data, headers } = res;
  console.log(data);
  const fileName = headers["content-disposition"].replace(
    /\w+;filename=(.*)/,
    "$1"
  );
  // const fileName = 'sss.xlsx'
  // 此处当返回json文件时需要先对data进行JSON.stringify处理，其他类型文件不用做处理
  //const blob = new Blob([JSON.stringify(data)], ...)
  const blob = new Blob([data], { type: headers["content-type"] });
  let dom = document.createElement("a");
  let url = window.URL.createObjectURL(blob);
  dom.href = url;
  dom.download = decodeURI(fileName);
  dom.style.display = "none";
  document.body.appendChild(dom);
  dom.click();
  dom.parentNode.removeChild(dom);
  window.URL.revokeObjectURL(url);
};

export const checkAmount = async (_rule, value) => {
  if (!value) {
    return Promise.reject("请输入金额");
  }
  if (value < 0.01) {
    return Promise.reject("金额最小为0.01");
  }
  if (!/^(0|[1-9][0-9]*)(\.\d+)?$/.test(value)) {
    return Promise.reject("金额格式不对");
  }
  return Promise.resolve();
};

export const removeToken = () => {
  window.localStorage.removeItem("nailToken");
};

export const getToken = () => {
  return window.localStorage.getItem("nailToken");
};

export const setToken = (token) => {
  window.localStorage.setItem("nailToken", token);
};

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();
  return result;
}
