// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'assets/custom-theme/index.css'; // https://github.com/PanJiaChen/custom-element-theme
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'normalize.css/normalize.css';
import 'styles/index.scss';
import 'components/Icon-svg/index';
import 'assets/iconfont/iconfont';
import * as filters from './filters';
import Multiselect from 'vue-multiselect';
import Sticky from 'components/Sticky';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import vueWaves from './directive/waves';
import vueSticky from './directive/sticky';
import errLog from 'store/errLog';
import './mock/index.js';  //使用api请求时请将此行注释，不然将被mock拦截
// import './styles/mixin.scss';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.use(vueSticky);


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
// register global progress.
const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.getters.token) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (to.meta && to.meta.role) {
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next();
        } else {
          next('/401');
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

// window.onunhandledrejection = e => {
//     console.log('unhandled', e.reason, e.promise);
//     e.preventDefault()
// };

// 生产环境错误日志
if (process.env === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     console.log('window')
// };
//
// console.error = (function (origin) {
//     return function (errorlog) {
//         // handler();//基于业务的日志记录及数据报错
//         console.log('console'+errorlog)
//         origin.call(console, errorlog);
//     }
// })(console.error);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


