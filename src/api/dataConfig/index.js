import request from '@/utils/request';

export function getTreeData() {
  return request({
    url: '/push_engine/pushInterface/selectSourceData',
    method: 'POST',
  });
}

export function checkInterfaceType(params) {
  return request({
    url: '/push_engine/pushInterface/checkInterfaceType',
    method: 'GET',
    params,
  });
}

export function addSourceDataTree(data) {
  return request({
    url: '/push_engine/pushInterface/addSourceDataTree',
    method: 'POST',
    data,
  });
}

export function updateSourceDataTree(data) {
  return request({
    url: '/push_engine/pushInterface/updateSourceDataTree',
    method: 'POST',
    data,
  });
}

export function deleteSourceDataTree(params) {
  return request({
    url: '/push_engine/pushInterface/removeSourceDataTree',
    method: 'GET',
    params,
  });
}

export function selectPushInterfaceById(data) {
  return request({
    url: '/push_engine/pushInterface/selectPushInterfaceById',
    method: 'POST',
    data,
  });
}

export function editPushInterface(data) {
  return request({
    url: '/push_engine/pushInterface/editPushInterface',
    method: 'POST',
    data,
  });
}

export function getSelectPushDataSourcesDown() {
  return request({
    url: '/push_engine/pushInterface/selectPushDataSourcesDown',
    method: 'POST',
  });
}

export function checkInterfaceCode(params) {
  return request({
    url: '/push_engine/pushInterface/checkInterfaceCode',
    method: 'GET',
    params,
  });
}

export function addPushInterface(data) {
  return request({
    url: '/push_engine/pushInterface/addPushInterface',
    method: 'POST',
    data,
  });
}

export function deletePushInterface(data) {
  return request({
    url: '/push_engine/pushInterface/deletePushInterface',
    method: 'POST',
    data,
  });
}
