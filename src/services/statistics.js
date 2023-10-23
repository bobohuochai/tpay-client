import aIns from "./index";

export const getApi = (params) => {
  return aIns.get("/statisticsData/getData", { params });
};

export const dashboardApi = () => {
  return aIns.get("/statistics/dashboard");
};

export const cardListApi = () => {
  return aIns.get("/card/homePage");
};
