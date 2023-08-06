import aIns from './index';

export const get = (params) => {
  return aIns.get('/statisticsData/getData', { params });
}
