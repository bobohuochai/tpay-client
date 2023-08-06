import aIns from './index';

export const createOrder = (params) => {
  return aIns.post("/kyc/requestKyc", params);
};

export const get = () => {
  return aIns.get("/kyc/get");
};