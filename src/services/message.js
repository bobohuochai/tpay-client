import aIns from './index';

export const send = (params) => {
  return aIns.get('/message/send', params);
}

export const checkAuthCode = (params) => {
  return aIns.post('/message/checkAuthCode', params);
}