import aIns from "./index";

export const getNewMessageApi = (params) => {
  return aIns.get("/notice/newMessage", params);
};
