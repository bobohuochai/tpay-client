import aIns from './index';

export const derive = (params) => {
  return aIns.get('/comptroller/derive', { params, responseType: 'blob' });
}

export const paging = (params) => {
  return aIns.get('/comptroller/paging', { params });
}