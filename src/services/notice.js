import aIns from './index';

export const paging = (params) => {
  return aIns.get('/notice/paging', params);
}