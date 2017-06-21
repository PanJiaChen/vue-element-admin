import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');
const sendPWD = _import('login/sendpwd');
const reset = _import('login/reset');

/* dashboard */
const dashboard = _import('dashboard/index');

/* Introduction */
const Introduction = _import('introduction/index');

/* components */
const componentsIndex = _import('components/index');
const Tinymce = _import('components/tinymce');
const Markdown = _import('components/markdown');
const JsonEditor = _import('components/jsoneditor');
const DndList = _import('components/dndlist');
const AvatarUpload = _import('components/avatarUpload');
const Dropzone = _import('components/dropzone');
const Sticky = _import('components/sticky');
const SplitPane = _import('components/splitpane');
const CountTo = _import('components/countTo');
const Mixin = _import('components/mixin');


/* charts */
const chartIndex = _import('charts/index');
const KeyboardChart = _import('charts/keyboard');
const KeyboardChart2 = _import('charts/keyboard2');
const LineMarker = _import('charts/line');
const MixChart = _import('charts/mixchart');

/* error page */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

/* error log */
const ErrorLog = _import('errlog/index');

/* excel */
const ExcelDownload = _import('excel/index');

/* theme  */
const Theme = _import('theme/index');

/* example*/
const TableLayout = _import('example/table/index');
const DynamicTable = _import('example/table/dynamictable');
const Table = _import('example/table/table');
const DragTable = _import('example/table/dragTable');
const InlineEditTable = _import('example/table/inlineEditTable');

const Form = _import('example/form');
const Tab = _import('example/tab/index');

/* permission */
const Permission = _import('permission/index');


Vue.use(Router);

 /**
  * icon : the icon show in the sidebar
  * hidden : if hidden:true will not show in the sidebar
  * redirect : if redirect:noredirect will not redirct in the levelbar
  * noDropdown : if noDropdown:true will not has submenu
  * meta : { role: ['admin'] }  will control the page role
  **/

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    { path: '/authredirect', component: authRedirect, hidden: true },
    { path: '/sendpwd', component: sendPWD, hidden: true },
    { path: '/reset', component: reset, hidden: true },
    { path: '/404', component: Err404, hidden: true },
    { path: '/401', component: Err401, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  },
  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    icon: 'xinrenzhinan',
    noDropdown: true,
    children: [{ path: 'index', component: Introduction, name: '简述' }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    name: '权限测试',
    icon: 'quanxian',
    meta: { role: ['admin'] },
    noDropdown: true,
    children: [{ path: 'index', component: Permission, name: '权限测试页', meta: { role: ['admin'] } }]
  },
  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: '组件',
    icon: 'zujian',
    children: [
      { path: 'index', component: componentsIndex, name: '介绍 ' },
      { path: 'tinymce', component: Tinymce, name: '富文本编辑器' },
      { path: 'markdown', component: Markdown, name: 'Markdown' },
      { path: 'jsoneditor', component: JsonEditor, name: 'JSON编辑器' },
      { path: 'dndlist', component: DndList, name: '列表拖拽' },
      { path: 'splitpane', component: SplitPane, name: 'SplitPane' },
      { path: 'avatarupload', component: AvatarUpload, name: '头像上传' },
      { path: 'dropzone', component: Dropzone, name: 'Dropzone' },
      { path: 'sticky', component: Sticky, name: 'Sticky' },
      { path: 'countto', component: CountTo, name: 'CountTo' },
      { path: 'mixin', component: Mixin, name: '小组件' }
    ]
  },
  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/index',
    name: '图表',
    icon: 'tubiaoleixingzhengchang',
    children: [
      { path: 'index', component: chartIndex, name: '介绍' },
      { path: 'keyboard', component: KeyboardChart, name: '键盘图表' },
      { path: 'keyboard2', component: KeyboardChart2, name: '键盘图表2' },
      { path: 'line', component: LineMarker, name: '折线图' },
      { path: 'mixchart', component: MixChart, name: '混合图表' }
    ]
  },
  {
    path: '/errorpage',
    component: Layout,
    redirect: 'noredirect',
    name: '错误页面',
    icon: '404',
    children: [
      { path: '401', component: Err401, name: '401' },
      { path: '404', component: Err404, name: '404' }
    ]
  },
  {
    path: '/errlog',
    component: Layout,
    redirect: 'noredirect',
    name: 'errlog',
    icon: 'bug',
    noDropdown: true,
    children: [{ path: 'log', component: ErrorLog, name: '错误日志' }]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: 'noredirect',
    name: 'excel',
    icon: 'EXCEL',
    noDropdown: true,
    children: [{ path: 'download', component: ExcelDownload, name: '导出excel' }]
  },
  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    name: 'theme',
    icon: 'theme',
    noDropdown: true,
    children: [{ path: 'index', component: Theme, name: '换肤' }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: '综合实例',
    icon: 'zonghe',
    children: [
      {
        path: '/example/table',
        component: TableLayout,
        redirect: '/example/table/table',
        name: 'Table',
        children: [
          { path: 'dynamictable', component: DynamicTable, name: '动态table' },
          { path: 'dragtable', component: DragTable, name: '拖拽table' },
          { path: 'inline_edit_table', component: InlineEditTable, name: 'table内编辑' },
          { path: 'table', component: Table, name: '综合table' }
        ]
      },
      { path: 'form/edit', component: Form, name: '编辑Form', meta: { isEdit: true } },
      { path: 'form/create', component: Form, name: '创建Form' },

      { path: 'tab/index', component: Tab, name: 'Tab' }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];
