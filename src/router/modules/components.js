/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noredirect',
  name: 'component-demo',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/components-demo/tinymce'),
      name: 'tinymce-demo',
      meta: { title: 'tinymce' }
    },
    {
      path: 'markdown',
      component: () => import('@/views/components-demo/markdown'),
      name: 'markdown-demo',
      meta: { title: 'markdown' }
    },
    {
      path: 'json-editor',
      component: () => import('@/views/components-demo/jsonEditor'),
      name: 'jsonEditor-demo',
      meta: { title: 'jsonEditor' }
    },
    {
      path: 'splitpane',
      component: () => import('@/views/components-demo/splitpane'),
      name: 'splitpane-demo',
      meta: { title: 'splitPane' }
    },
    {
      path: 'avatar-upload',
      component: () => import('@/views/components-demo/avatarUpload'),
      name: 'avatarUpload-demo',
      meta: { title: 'avatarUpload' }
    },
    {
      path: 'dropzone',
      component: () => import('@/views/components-demo/dropzone'),
      name: 'dropzone-demo',
      meta: { title: 'dropzone' }
    },
    {
      path: 'sticky',
      component: () => import('@/views/components-demo/sticky'),
      name: 'sticky-demo',
      meta: { title: 'sticky' }
    },
    {
      path: 'count-to',
      component: () => import('@/views/components-demo/countTo'),
      name: 'countTo-demo',
      meta: { title: 'countTo' }
    },
    {
      path: 'mixin',
      component: () => import('@/views/components-demo/mixin'),
      name: 'componentMixin-demo',
      meta: { title: 'componentMixin' }
    },
    {
      path: 'back-to-top',
      component: () => import('@/views/components-demo/backToTop'),
      name: 'backToTop-demo',
      meta: { title: 'backToTop' }
    },
    {
      path: 'drag-dialog',
      component: () => import('@/views/components-demo/dragDialog'),
      name: 'dragDialog-demo',
      meta: { title: 'dragDialog' }
    },
    {
      path: 'dnd-list',
      component: () => import('@/views/components-demo/dndList'),
      name: 'dndList-demo',
      meta: { title: 'dndList' }
    },
    {
      path: 'drag-kanban',
      component: () => import('@/views/components-demo/dragKanban'),
      name: 'dragKanban-demo',
      meta: { title: 'dragKanban' }
    }
  ]
}

export default componentsRouter
