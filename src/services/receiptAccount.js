import aIns from "./index";

export const groupByChannel = (params) => {
  return aIns.get("/receiptAccount/groupByChannel", { params });
};

export const listAll = (params) => {
    return aIns.get("/receiptAccount/listAll", { params });
  };