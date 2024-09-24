import request from '@/utils/request';

export function downScriptTpl() {
  return request({
    url: '/push_engine/pushStrategy/downPushStrategyTemplate',
    method: 'GET',
    responseType: 'blob',
  });
}

export function getInterfaceData() {
  return request({
    url: '/push_engine/pushInterface/selectSourceDown',
    method: 'POST',
  });
}

export function getTargetData() {
  return request({
    url: '/push_engine/pushTarget/selectPushTargetDown',
    method: 'POST',
  });
}

export function add(data) {
  return request({
    url: '/push_engine/pushStrategy/addPushStrategy',
    method: 'POST',
    data,
  });
}

export function edit(data) {
  return request({
    url: '/push_engine/pushStrategy/updatePushStrategy',
    method: 'POST',
    data,
  });
}

export function del(data) {
  return request({
    url: '/push_engine/pushStrategy/deletePushStrategy',
    method: 'POST',
    data,
  });
}

export default { add, edit, del };
