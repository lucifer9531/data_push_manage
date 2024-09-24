import Vue from 'vue';

import 'normalize.css/normalize.css';
import './assets/styles/index.scss';

import App from './App';
import store from './store';
import router from './router/routers';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
