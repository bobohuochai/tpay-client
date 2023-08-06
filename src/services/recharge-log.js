import aIns from "./index";

export const paging = (params) => {
  return aIns.get("/rechargeLog/paging", { params });
};

export const createOrder = (params) => {
  return aIns.post("/rechargeLog/createOrder", params);
};

export const audit = (params) => {
  return aIns.post("/rechargeLog/audit", params);
};

export const getRate = (params) => {
  return aIns.get("/rechargeLog/getRate", { params });
};
export const calcRechargeFee = (params) => {
  return aIns.post("/rechargeLog/calcRechargeFee", { ...params });
};
