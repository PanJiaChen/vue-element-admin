/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const treeTableRouter = {
  path: '/tree-table',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'TreeTable',
  meta: {
    title: 'treeTable',
    icon: 'tree-table'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/tree-table/index'),
      name: 'TreeTableDemo',
      meta: { title: 'treeTable' }
    },
    {
      path: 'custom',
      component: () => import('@/views/tree-table/custom'),
      name: 'CustomTreeTableDemo',
      meta: { title: 'customTreeTable' }
    }
  ]
}
export default treeTableRouter
