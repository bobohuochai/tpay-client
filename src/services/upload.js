import aIns from './index';

export const upload = (params) => {
  return aIns.post('/upload/upload', params, {
    headers: {
      'Content-type': 'multipart/form-data',
    },
  });
}

export const generateTokenUrl = (params) => {
  return aIns.get('/upload/generateTokenUrl', { params });
}