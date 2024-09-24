import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/targetConfig',
    meta: { title: '推送目标配置', meta: '推送目标配置', noCache: true },
    component: (resolve) => require(['@/views/targetConfig'], resolve),
  },
  {
    path: '/strategyConfig',
    meta: { title: '推送策略配置', meta: '推送策略配置', noCache: true },
    component: (resolve) => require(['@/views/strategyConfig'], resolve),
  },
  {
    path: '/dataDetails',
    meta: { title: '推送数据明细', meta: '推送数据明细', noCache: true },
    component: (resolve) => require(['@/views/dataDetails'], resolve),
  },
  {
    path: '/monitor',
    meta: { title: '推送监控告警', meta: '推送监控告警', noCache: true },
    component: (resolve) => require(['@/views/monitor'], resolve),
  },
  {
    path: '/dataConfig',
    meta: { title: '推送数据配置', meta: '推送数据配置', noCache: true },
    component: (resolve) => require(['@/views/dataConfig'], resolve),
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: (resolve) => require(['@/views/home'], resolve),
  //       name: 'Dashboard',
  //       meta: { title: '首页', icon: 'index', affix: true, noCache: true }
  //     }
  //   ]
  // },
];

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});
