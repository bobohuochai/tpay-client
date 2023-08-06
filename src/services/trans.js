import aIns from './index';

export const authPaging = (params) => {
  return aIns.get('/trans/authPaging', { params });
}

export const paging = (params) => {
  return aIns.get('/trans/paging', { params });
}

export const deriveAuthData = (params) => {
  return aIns.get('/trans/deriveAuthData', { params, responseType: 'blob' });
}

export const deriveClearData = (params) => {
  return aIns.get('/trans/deriveClearData', { params, responseType: 'blob' });
}

export const transDetail = (params) => {
  return aIns.get('/trans/authDetail', { params })
}