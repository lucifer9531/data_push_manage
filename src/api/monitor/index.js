import request from '@/utils/request';

export function updatePushAlertEnable(data) {
  return request({
    url: '/push_engine/pushAlert/updatePushAlertEnable',
    method: 'POST',
    data,
  });
}

export function getSelectPushUserAllNotPage() {
  return request({
    url: '/push_engine/pushUser/selectPushUserAllNotPage',
    method: 'POST',
  });
}

export function checkAlertName(params) {
  return request({
    url: '/push_engine/pushAlert/checkAlertName',
    method: 'GET',
    params,
  });
}

export function getPushAlertRecById(params) {
  return request({
    url: '/push_engine/pushAlert/getPushAlertRecById',
    method: 'GET',
    params,
  });
}

export function getPushAlertById(params) {
  return request({
    url: '/push_engine/pushAlert/getPushAlertById',
    method: 'GET',
    params,
  });
}

export function add(data) {
  return request({
    url: '/push_engine/pushAlert/addPushAlert',
    method: 'POST',
    data,
  });
}

export function edit(data) {
  return request({
    url: '/push_engine/pushAlert/updatePushAlert',
    method: 'POST',
    data,
  });
}

export function del(ids) {
  return request({
    url: '/push_engine/pushAlert/deletePushAlert',
    method: 'GET',
    params: {
      alertIds: ids,
    },
  });
}

export default { add, edit, del };
