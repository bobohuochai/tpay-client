import aIns from './index';

export const paging = (params) => {
  return aIns.get('/walletDetail/paging', { params });
}

export const derive = (params) => {
  return aIns.get('/walletDetail/derive', { params, responseType: 'blob' });
}