import request from '@/utils/request';

export const exportResultShowExcel = (data) => {
  return request({
    url: '/push_engine/pushRecord/exportResultShowExcel',
    method: 'POST',
    data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadCcpData = (data) => {
  return request({
    url: '/push_engine/pushRecord/uploadCcpData',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const rePushRecord = (data) => {
  return request({
    url: '/push_engine/pushRecord/rePushRecord',
    method: 'POST',
    data,
  });
};

export const getResultShowDetail = (data) => {
  return request({
    url: '/push_engine/pushRecord/getResultShowDetail',
    method: 'POST',
    data,
  });
};

export const getSelectStrategyDown = () => {
  return request({
    url: '/push_engine/pushStrategy/selectStrategyDown',
    method: 'POST',
  });
};

export const getSelectSourceDataStatistics = (data) => {
  return request({
    url: '/push_engine/pushRecord/selectSourceDataStatistics',
    method: 'POST',
    data,
  });
};

export const getSelectStrategyStatistics = (data) => {
  return request({
    url: '/push_engine/pushRecord/selectStrategyStatistics',
    method: 'POST',
    data,
  });
};

export const getSelectTargetStatistics = (data) => {
  return request({
    url: '/push_engine/pushRecord/selectTargetStatistics',
    method: 'POST',
    data,
  });
};
