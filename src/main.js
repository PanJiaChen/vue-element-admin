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
import './mock/index.js';  // 使用api请求时请将此行注释，不然将被mock拦截!!
// import './styles/mixin.scss';
import permission from 'store/permission';

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

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true; // admin权限 直接通过
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'];// 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启Progress
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (to.meta && to.meta.role) { // 判断即将进入的页面是否需要权限
        if (store.getters.uid) { // 判断当前用户是否已拉去玩info信息
          if (hasPermission(store.getters.roles, to.meta.role)) { // 判断权限
            next(); // 有权限
          } else {
            next('/401'); // 无权限
          }
        } else { // 未拉去info信息
          store.dispatch('GetInfo').then(() => { // 拉取info
            permission.init({ // 初始化权限
              roles: store.getters.roles,
              router: router.options.routes
            });
            if (hasPermission(store.getters.roles, to.meta.role)) { // 判断权限
              next();// 有权限
            } else {
              next('/401');// 无权限
            }
          }).catch(err => {
            console.log(err);
          });
        }
      } else { // 页面不需要权限 直接进入
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登入白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
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


