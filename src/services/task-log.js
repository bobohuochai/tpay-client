import aIns from './index';

export const batch = (data, options) => {
  return aIns.post('/taskLog/batch', data, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
    ...options
  });
}

export const listAll = (params) => {
  return aIns.get('/taskLog/listAll', { params });
}
