import request from '@/utils/request';
import qs from 'qs';

export function initData(url, data) {
  return request({
    url,
    method: 'POST',
    data,
  });
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'GET',
    responseType: 'blob',
  });
}

export function uploadScript(data) {
  return request({
    url: '/push_engine/pushTarget/uploadScript',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
