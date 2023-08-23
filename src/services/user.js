import aIns from './index';

export const login = (params) => {
  return aIns.post('/vccuser/login', params);
}

export const get = (params) => {
  return aIns.get('/vccuser/get', { params });
}

export const register = (params) => {
  return aIns.post('/vccuser/register', params);
}

export const paging = (params) => {
  return aIns.get('/vccuser/paging', { params });
}

export const listByEmail = (params) => {
  return aIns.get('/vccuser/listByEmail', { params });
}

export const updateStatus = (params) => {
  return aIns.post('/vccuser/updateStatus', params);
}

export const updatePayPassword = (params) => {
  return aIns.post('/vccuser/updatePayPassword', params);
}

export const updatePassword = (params) => {
  return aIns.post('/vccuser/updatePassword', params);
}

export const externalRegister = (params) => {
  return aIns.post('/vccuser/externalRegister', params);
}

export const active = (params) => {
  return aIns.post('/vccuser/active', params);
}

export const sendEmail = (params) => {
  return aIns.post('/email/sendEmail', params);
}

export const emailUpdatePassword = (params) => {
  return aIns.post('/vccuser/emailUpdatePassword', params);
}

export const sendAuthCode = (params) => {
  return aIns.post('/message/sendAuthCode', params);
}
export const sendAuthCodeForFree = (params) => {
  return aIns.post('/message/sendAuthCodeForFree', params);
}

export const payPasswordSwitch = (params) => {
  return aIns.post('/vccuser/payPasswordSwitch', params);
}

export const checkPayPassword = (params) => {
  return aIns.post('/vccuser/checkPayPassword', params);
}

export const updateNewFlag = (params) => {
  return aIns.post('/vccuser/updateNewFlag', params);
}

export const getRateTemplate = (params) => {
  return aIns.get('/vccuser/getRateTemplate', { params });
}

