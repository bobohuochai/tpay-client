import aIns from './index';

export const requestCard = (params) => {
  return aIns.post('/card/requestCard', params);
}

export const paging = (params) => {
  return aIns.get('/card/paging', { params });
}

export const cardList = (params) => {
  return aIns.get('/card/list', { params });
}

export const cardListAll = (params) => {
  return aIns.get('/card/listAll', { params });
}

export const queryCurrencys = (params) => {
  return aIns.post('/currency/listAll', { params });
}

export const calcApplyFee = (params) => {
  return aIns.post('/card/calcApplyFee', { ...params });
}
