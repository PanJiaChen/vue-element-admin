import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* icon : the icon show in the sidebar
* hidden : if `hidden:true` will not show in the sidebar
* title : the name show in submenu and levelbar
* redirect : if `redirect:noredirect` will no redirct in the levelbar
* meta : { role: ['admin'] }  will control the page role
**/

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页' }
    }]
  },

  {
    path: '/introduction',
    component: Layout,
    redirect: '/introduction/index',
    children: [{
      path: 'index',
      component: _import('introduction/index'),
      name: 'introduction',
      meta: { title: '简述', icon: 'people' }
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    meta: { role: ['admin'] },
    children: [{
      path: 'index',
      component: _import('permission/index'),
      name: 'permission',
      meta: {
        title: '权限测试页',
        icon: 'lock',
        role: ['admin']
      }
    }]
  },

  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: _import('svg-icons/index'),
      name: 'icons',
      meta: { title: '图标', icon: 'icon' }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: 'components',
    meta: {
      title: '组件',
      icon: 'component'
    },
    children: [
      { path: 'index', component: _import('components/index'), name: 'componentIndex', meta: { title: '介绍' }},
      { path: 'tinymce', component: _import('components/tinymce'), name: 'tinymce', meta: { title: '富文本编辑器' }},
      { path: 'markdown', component: _import('components/markdown'), name: 'markdown', meta: { title: 'Markdown' }},
      { path: 'json-editor', component: _import('components/jsonEditor'), name: 'jsonEditor', meta: { title: 'JSON编辑器' }},
      { path: 'dnd-list', component: _import('components/dndList'), name: 'dndList', meta: { title: '列表拖拽' }},
      { path: 'splitpane', component: _import('components/splitpane'), name: 'splitpane', meta: { title: 'SplitPane' }},
      { path: 'avatar-upload', component: _import('components/avatarUpload'), name: 'avatar-upload', meta: { title: '头像上传' }},
      { path: 'dropzone', component: _import('components/dropzone'), name: 'dropzone', meta: { title: 'Dropzone' }},
      { path: 'sticky', component: _import('components/sticky'), name: 'sticky', meta: { title: 'Sticky' }},
      { path: 'count-to', component: _import('components/countTo'), name: 'count-to', meta: { title: 'CountTo' }},
      { path: 'mixin', component: _import('components/mixin'), name: 'componentMixin', meta: { title: '小组件' }},
      { path: 'back-to-top', component: _import('components/backToTop'), name: 'backToTop', meta: { title: '返回顶部' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/index',
    name: 'charts',
    meta: {
      title: '图表',
      icon: 'chart'
    },
    children: [
      { path: 'index', component: _import('charts/index'), name: 'chartsIndex', meta: { title: '介绍' }},
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboard', meta: { title: '键盘图表' }},
      { path: 'keyboard2', component: _import('charts/keyboard2'), name: 'keyboard2', meta: { title: '键盘图表2' }},
      { path: 'line', component: _import('charts/line'), name: 'line', meta: { title: '折线图' }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: '混合图表' }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'example',
    meta: {
      title: '综合实例',
      icon: 'example'
    },
    children: [
      {
        path: '/example/table',
        component: _import('example/table/index'),
        redirect: '/example/table/table',
        name: 'Table',
        meta: {
          title: 'Table',
          icon: 'table'
        },
        children: [
          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: '动态table' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: '拖拽table' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'table内编辑' }},
          { path: 'table', component: _import('example/table/table'), name: 'tableDemo', meta: { title: '综合table' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'Tab' }},
      { path: 'form/edit', icon: 'form', component: _import('example/form'), name: 'formEdit', meta: { title: '编辑Form', isEdit: true }},
      { path: 'form/create', icon: 'form', component: _import('example/form'), name: 'FormCreate', meta: { title: '创建Form' }}
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: '错误页面',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: '401', meta: { title: '401' }},
      { path: '404', component: _import('errorPage/404'), name: '404', meta: { title: '404' }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errlog/index'), name: 'errorLog', meta: { title: '错误日志', icon: 'bug' }}]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/download',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      { path: 'export-excel', component: _import('excel/index'), name: 'exportExcel', meta: { title: 'export excel' }},
      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'export selected' }},
      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'upload excel' }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'zip', icon: 'zip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: '换肤', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboard', meta: { title: 'clipboard', icon: 'clipboard' }}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
