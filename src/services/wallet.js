import aIns from './index';

export const rechargeAmount = (params) => {
  return aIns.post('/wallet/rechargeAmount', params);
}