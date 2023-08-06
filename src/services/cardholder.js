import aIns from "./index";

export const updateStatus = (params) => {
  return aIns.post("/cardholder/updateStatus", params);
};

export const createCardholder = (params) => {
  return aIns.post("/cardholder/createCardholder", params);
};

export const updateCardholder = (params) => {
  return aIns.post("/cardholder/updateCardholder", params);
};

export const paging = (params) => {
  return aIns.get("/cardholder/paging", { params });
};

export const listByUserId = (params) => {
  return aIns.get("/cardholder/listByUserId", { params });
};


export const derive = (params) => {
  return aIns.get('/cardholder/', { params, responseType: 'blob'});
}
