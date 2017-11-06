import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

Vue.use(Router)

/* layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true          if `hidden:true` will not show in the sidebar(default is false)
* redirect: noredirect  if `redirect:noredirect` will no redirct in the levelbar
* meta : {
    role: ['admin']     will control the page role
    title: 'title'      the name show in submenu and levelbar
    icon: 'svg-name'    the icon show in the sidebar,
    noCache: true    if fasle ,the page will no be cached(default is false)
  }
**/

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard' }
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
      meta: { title: 'introduction', icon: 'people' }
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
        title: 'permission',
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
      meta: { title: 'icons', icon: 'icon' }
    }]
  },

  {
    path: '/components',
    component: Layout,
    redirect: '/components/index',
    name: 'components',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      { path: 'index', component: _import('components/index'), name: 'componentIndex', meta: { title: 'componentIndex' }},
      { path: 'tinymce', component: _import('components/tinymce'), name: 'tinymce', meta: { title: 'tinymce' }},
      { path: 'markdown', component: _import('components/markdown'), name: 'markdown', meta: { title: 'markdown' }},
      { path: 'json-editor', component: _import('components/jsonEditor'), name: 'jsonEditor', meta: { title: 'jsonEditor' }},
      { path: 'dnd-list', component: _import('components/dndList'), name: 'dndList', meta: { title: 'dndList' }},
      { path: 'splitpane', component: _import('components/splitpane'), name: 'splitpane', meta: { title: 'splitPane' }},
      { path: 'avatar-upload', component: _import('components/avatarUpload'), name: 'avatarUpload', meta: { title: 'avatarUpload' }},
      { path: 'dropzone', component: _import('components/dropzone'), name: 'dropzone', meta: { title: 'dropzone' }},
      { path: 'sticky', component: _import('components/sticky'), name: 'sticky', meta: { title: 'sticky' }},
      { path: 'count-to', component: _import('components/countTo'), name: 'countTo', meta: { title: 'countTo' }},
      { path: 'mixin', component: _import('components/mixin'), name: 'componentMixin', meta: { title: 'componentMixin' }},
      { path: 'back-to-top', component: _import('components/backToTop'), name: 'backToTop', meta: { title: 'backToTop' }}
    ]
  },

  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/index',
    name: 'charts',
    meta: {
      title: 'charts',
      icon: 'chart'
    },
    children: [
      { path: 'index', component: _import('charts/index'), name: 'chartsIndex', meta: { title: 'chartsIndex' }},
      { path: 'keyboard', component: _import('charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart' }},
      { path: 'keyboard2', component: _import('charts/keyboard2'), name: 'keyboardChart2', meta: { title: 'keyboardChart2' }},
      { path: 'line', component: _import('charts/line'), name: 'lineChart', meta: { title: 'lineChart' }},
      { path: 'mixchart', component: _import('charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart' }}
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: 'noredirect',
    name: 'example',
    meta: {
      title: 'example',
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
          { path: 'dynamic-table', component: _import('example/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
          { path: 'drag-table', component: _import('example/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
          { path: 'inline-edit-table', component: _import('example/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
          { path: 'complex-table', component: _import('example/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
        ]
      },
      { path: 'tab/index', icon: 'tab', component: _import('example/tab/index'), name: 'tab', meta: { title: 'tab' }}
    ]
  },

  {
    path: '/form',
    component: Layout,
    redirect: 'noredirect',
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      { path: 'create-form', component: _import('form/create'), name: 'createForm', meta: { title: 'createForm', icon: 'table' }},
      { path: 'edit-form', component: _import('form/edit'), name: 'editForm', meta: { title: 'editForm', icon: 'table' }}
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
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
      { path: 'export-excel', component: _import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel', noCache: true }},
      { path: 'export-selected-excel', component: _import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel', noCache: true }},
      { path: 'upload-excel', component: _import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel', noCache: true }}
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    children: [{ path: 'download', component: _import('zip/index'), name: 'exportZip', meta: { title: 'exportZip', icon: 'zip' }}]
  },

  {
    path: '/theme',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  },

  {
    path: '/clipboard',
    component: Layout,
    redirect: 'noredirect',
    children: [{ path: 'index', component: _import('clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  },

  {
    path: '/i18n',
    component: Layout,
    children: [{ path: 'index', component: _import('i18n/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  },

  { path: '*', redirect: '/404', hidden: true }
]
