import axios from 'axios';
import Config from '@/settings';

const service = axios.create({
  // baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/',
  timeout: Config.timeout,
});

service.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let code = 0;
    try {
      code = error.response.data.status;
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        this.$message.error('网络请求超时');
        return Promise.reject(error);
      }
    }
    if (code) {
      const errorMsg = error.response.data.message;
      if (errorMsg !== undefined) {
        this.$message.error('errorMsg');
      }
    } else {
      this.$message.error('接口请求失败');
    }
    return Promise.reject(error);
  },
);
export default service;
