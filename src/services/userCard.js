import aIns from './index';

export const paging = (params) => {
  return aIns.get('/userCard/paging', { params });
}

export const recharge = (params) => {
  return aIns.post('/userCard/recharge', params);
}

export const calcCardRechargeFee = (params) => {
  return aIns.post('/userCard/calcCardRechargeFee', params);
}

export const out = (params) => {
  return aIns.post('/userCard/out', params);
}

export const calcCardOutFee = (params) => {
  return aIns.post('/userCard/calcCardOutFee', params);
}

export const updateRemark = (params) => {
  return aIns.post('/userCard/updateRemark', params);
}

export const freezeAndUnFreeze = (params) => {
  return aIns.post('/userCard/freezeAndUnFreeze', params);
}

export const close = (params) => {
  return aIns.post('/userCard/close', params);
}

export const derive = (params) => {
  return aIns.get('/userCard/derive', { params, responseType: 'blob'});
}

export const listUserCardWallet = (params) => {
  return aIns.get('/userCard/listUserCardWallet', { params });
}

export const updateUserCardWallet = (params) => {
  return aIns.post('/userCard/updateUserCardWallet', params);
}

export const verifyPayPassword = (params) => {
  return aIns.get('/userCard/verifyPayPassword', { params });
}


export const showUserCardInfo = (params) => {
  return aIns.post('/userCard/showUserCardInfo', params);
}