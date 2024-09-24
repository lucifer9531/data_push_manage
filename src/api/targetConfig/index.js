import request from '@/utils/request';

export function checkTargetName(params) {
  return request({
    url: '/push_engine/pushTarget/checkTargetName',
    method: 'GET',
    params,
  });
}

export function downScriptTpl() {
  return request({
    url: '/push_engine/pushTarget/downPushTemplate',
    method: 'GET',
    responseType: 'blob',
  });
}

export function add(data) {
  return request({
    url: '/push_engine/pushTarget/insertPushTarget',
    method: 'POST',
    data,
  });
}

export function edit(data) {
  return request({
    url: '/push_engine/pushTarget/updatePushTarget',
    method: 'POST',
    data,
  });
}

export function del(ids) {
  return request({
    url: '/push_engine/pushTarget/deletePushTarget',
    method: 'GET',
    params: {
      targetIds: ids,
    },
  });
}

export default { add, edit, del };
