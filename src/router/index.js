import router from './routers';
import Config from '@/settings';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title;
  }
  NProgress.start();
  if (to.path === '/login') {
    next({ path: '/' });
    NProgress.done();
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});
