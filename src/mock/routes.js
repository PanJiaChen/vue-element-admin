const asyncRoutesMap = [
  {
    id: '1',
    path: '/permission',
    component: 'layout/Layout',
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        id: '2',
        path: 'page',
        component: 'permission/page',
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin']
        }
      },
      {
        id: '3',
        path: 'directive',
        component: 'permission/directive',
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission',
          roles: ['admin', 'editor']
        }
      },
      {
        id: '66',
        path: 'role',
        component: 'permission/role',
        name: 'role',
        meta: {
          title: 'rolePermission',
          roles: ['admin']
        }
      }
    ]
  },

  {
    id: '4',
    path: '/icon',
    component: 'layout/Layout',
    children: [
      {
        id: '5',
        path: 'index',
        component: 'svg-icons/index',
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true, roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '6',
    path: '/components',
    component: 'layout/Layout',
    redirect: 'noredirect',
    name: 'ComponentDemo',
    meta: {
      title: 'components',
      icon: 'component',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '7',
        path: 'tinymce',
        component: 'components-demo/tinymce',
        name: 'TinymceDemo',
        meta: { title: 'tinymce', roles: ['admin', 'editor'] }
      },
      {
        id: '8',
        path: 'markdown',
        component: 'components-demo/markdown',
        name: 'MarkdownDemo',
        meta: { title: 'markdown', roles: ['admin', 'editor'] }
      },
      {
        id: '9',
        path: 'json-editor',
        component: 'components-demo/jsonEditor',
        name: 'JsonEditorDemo',
        meta: { title: 'jsonEditor', roles: ['admin', 'editor'] }
      },
      {
        id: '10',
        path: 'splitpane',
        component: 'components-demo/splitpane',
        name: 'SplitpaneDemo',
        meta: { title: 'splitPane', roles: ['admin', 'editor'] }
      },
      {
        id: '11',
        path: 'avatar-upload',
        component: 'components-demo/avatarUpload',
        name: 'AvatarUploadDemo',
        meta: { title: 'avatarUpload', roles: ['admin', 'editor'] }
      },
      {
        id: '12',
        path: 'dropzone',
        component: 'components-demo/dropzone',
        name: 'DropzoneDemo',
        meta: { title: 'dropzone', roles: ['admin', 'editor'] }
      },
      {
        id: '13',
        path: 'sticky',
        component: 'components-demo/sticky',
        name: 'StickyDemo',
        meta: { title: 'sticky', roles: ['admin', 'editor'] }
      },
      {
        id: '14',
        path: 'count-to',
        component: 'components-demo/countTo',
        name: 'CountToDemo',
        meta: { title: 'countTo', roles: ['admin', 'editor'] }
      },
      {
        id: '15',
        path: 'mixin',
        component: 'components-demo/mixin',
        name: 'ComponentMixinDemo',
        meta: { title: 'componentMixin', roles: ['admin', 'editor'] }
      },
      {
        id: '16',
        path: 'back-to-top',
        component: 'components-demo/backToTop',
        name: 'BackToTopDemo',
        meta: { title: 'backToTop', roles: ['admin', 'editor'] }
      },
      {
        id: '17',
        path: 'drag-dialog',
        component: 'components-demo/dragDialog',
        name: 'DragDialogDemo',
        meta: { title: 'dragDialog', roles: ['admin', 'editor'] }
      },
      {
        id: '18',
        path: 'drag-select',
        component: 'components-demo/dragSelect',
        name: 'DragSelectDemo',
        meta: { title: 'dragSelect', roles: ['admin', 'editor'] }
      },
      {
        id: '19',
        path: 'dnd-list',
        component: 'components-demo/dndList',
        name: 'DndListDemo',
        meta: { title: 'dndList', roles: ['admin', 'editor'] }
      },
      {
        id: '20',
        path: 'drag-kanban',
        component: 'components-demo/dragKanban',
        name: 'DragKanbanDemo',
        meta: { title: 'dragKanban', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '21',
    path: '/charts',
    component: 'layout/Layout',
    redirect: 'noredirect',
    name: 'Charts',
    meta: {
      title: 'charts',
      icon: 'chart',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '22',
        path: 'keyboard',
        component: 'charts/keyboard',
        name: 'KeyboardChart',
        meta: { title: 'keyboardChart', noCache: true, roles: ['admin', 'editor'] }
      },
      {
        id: '23',
        path: 'line',
        component: 'charts/line',
        name: 'LineChart',
        meta: { title: 'lineChart', noCache: true, roles: ['admin', 'editor'] }
      },
      {
        id: '24',
        path: 'mixchart',
        component: 'charts/mixChart',
        name: 'MixChart',
        meta: { title: 'mixChart', noCache: true, roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '25',
    path: '/nested',
    component: 'layout/Layout',
    redirect: '/nested/menu1/menu1-1',
    name: 'Nested',
    meta: {
      title: 'nested',
      icon: 'nested',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '26',
        path: 'menu1',
        component: 'nested/menu1/index', // Parent router-view
        name: 'Menu1',
        meta: { title: 'menu1', roles: ['admin', 'editor'] },
        redirect: '/nested/menu1/menu1-1',
        children: [
          {
            id: '27',
            path: 'menu1-1',
            component: 'nested/menu1/menu1-1',
            name: 'Menu1-1',
            meta: { title: 'menu1-1', roles: ['admin', 'editor'] }
          },
          {
            id: '28',
            path: 'menu1-2',
            component: 'nested/menu1/menu1-2',
            name: 'Menu1-2',
            redirect: '/nested/menu1/menu1-2/menu1-2-1',
            meta: { title: 'menu1-2', roles: ['admin', 'editor'] },
            children: [
              {
                id: '29',
                path: 'menu1-2-1',
                component: 'nested/menu1/menu1-2/menu1-2-1',
                name: 'Menu1-2-1',
                meta: { title: 'menu1-2-1', roles: ['admin', 'editor'] }
              },
              {
                id: '30',
                path: 'menu1-2-2',
                component: 'nested/menu1/menu1-2/menu1-2-2',
                name: 'Menu1-2-2',
                meta: { title: 'menu1-2-2', roles: ['admin', 'editor'] }
              }
            ]
          },
          {
            id: '31',
            path: 'menu1-3',
            component: 'nested/menu1/menu1-3',
            name: 'Menu1-3',
            meta: { title: 'menu1-3', roles: ['admin', 'editor'] }
          }
        ]
      },
      {
        id: '32',
        path: 'menu2',
        name: 'Menu2',
        component: 'nested/menu2/index',
        meta: { title: 'menu2', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '33',
    path: '/table',
    component: 'layout/Layout',
    redirect: '/table/complex-table',
    name: 'Table',
    meta: {
      title: 'Table',
      icon: 'table',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '34',
        path: 'dynamic-table',
        component: 'table/dynamicTable/index',
        name: 'DynamicTable',
        meta: { title: 'dynamicTable', roles: ['admin', 'editor'] }
      },
      {
        id: '35',
        path: 'drag-table',
        component: 'table/dragTable',
        name: 'DragTable',
        meta: { title: 'dragTable', roles: ['admin', 'editor'] }
      },
      {
        id: '36',
        path: 'inline-edit-table',
        component: 'table/inlineEditTable',
        name: 'InlineEditTable',
        meta: { title: 'inlineEditTable', roles: ['admin', 'editor'] }
      },
      {
        id: '37',
        path: 'tree-table',
        component: 'table/treeTable/treeTable',
        name: 'TreeTableDemo',
        meta: { title: 'treeTable', roles: ['admin', 'editor'] }
      },
      {
        id: '38',
        path: 'custom-tree-table',
        component: 'table/treeTable/customTreeTable',
        name: 'CustomTreeTableDemo',
        meta: { title: 'customTreeTable', roles: ['admin', 'editor'] }
      },
      {
        id: '39',
        path: 'complex-table',
        component: 'table/complexTable',
        name: 'ComplexTable',
        meta: { title: 'complexTable', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '40',
    path: '/example',
    component: 'layout/Layout',
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'example',
      icon: 'example',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '41',
        path: 'create',
        component: 'example/create',
        name: 'CreateArticle',
        meta: { title: 'createArticle', icon: 'edit', roles: ['admin', 'editor'] }
      },
      {
        id: '42',
        path: 'edit/:id(\\d+)',
        component: 'example/edit',
        name: 'EditArticle',
        meta: { title: 'editArticle', noCache: true, roles: ['admin', 'editor'] },
        hidden: true
      },
      {
        id: '43',
        path: 'list',
        component: 'example/list',
        name: 'ArticleList',
        meta: { title: 'articleList', icon: 'list', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    path: '/tab',
    component: 'layout/Layout',
    children: [
      {
        id: '44',
        path: 'index',
        component: 'tab/index',
        name: 'Tab',
        meta: { title: 'tab', icon: 'tab', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '45',
    path: '/error',
    component: 'layout/Layout',
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '46',
        path: '401',
        component: 'errorPage/401',
        name: 'Page401',
        meta: { title: 'page401', noCache: true, roles: ['admin', 'editor'] }
      },
      {
        id: '47',
        path: '404',
        component: 'errorPage/404',
        name: 'Page404',
        meta: { title: 'page404', noCache: true, roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '48',
    path: '/error-log',
    component: 'layout/Layout',
    redirect: 'noredirect',
    children: [
      {
        id: '67',
        path: 'log',
        component: 'errorLog/index',
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '49',
    path: '/excel',
    component: 'layout/Layout',
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'excel',
      icon: 'excel',
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '50',
        path: 'export-excel',
        component: 'excel/exportExcel',
        name: 'ExportExcel',
        meta: { title: 'exportExcel', roles: ['admin', 'editor'] }
      },
      {
        id: '51',
        path: 'export-selected-excel',
        component: 'excel/selectExcel',
        name: 'SelectExcel',
        meta: { title: 'selectExcel', roles: ['admin', 'editor'] }
      },
      {
        id: '52',
        path: 'upload-excel',
        component: 'excel/uploadExcel',
        name: 'UploadExcel',
        meta: { title: 'uploadExcel', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '53',
    path: '/zip',
    component: 'layout/Layout',
    redirect: '/zip/download',
    alwaysShow: true,
    meta: { title: 'zip', icon: 'zip', roles: ['admin', 'editor'] },
    children: [
      {
        id: '54',
        path: 'download',
        component: 'zip/index',
        name: 'ExportZip',
        meta: { title: 'exportZip', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '55',
    path: '/pdf',
    component: 'layout/Layout',
    redirect: '/pdf/index',
    children: [
      {
        id: '56',
        path: 'index',
        component: 'pdf/index',
        name: 'PDF',
        meta: { title: 'pdf', icon: 'pdf', roles: ['admin', 'editor'] }
      }
    ]
  },
  {
    id: '57',
    path: '/pdf/download',
    component: 'pdf/download',
    hidden: true
  },

  {
    id: '58',
    path: '/theme',
    component: 'layout/Layout',
    redirect: 'noredirect',
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '59',
        path: 'index',
        component: 'theme/index',
        name: 'Theme',
        meta: { title: 'theme', icon: 'theme', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '60',
    path: '/clipboard',
    component: 'layout/Layout',
    redirect: 'noredirect',
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '61',
        path: 'index',
        component: 'clipboard/index',
        name: 'ClipboardDemo',
        meta: { title: 'clipboardDemo', icon: 'clipboard', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '62',
    path: '/i18n',
    component: 'layout/Layout',
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '63',
        path: 'index',
        component: 'i18n-demo/index',
        name: 'I18n',
        meta: { title: 'i18n', icon: 'international', roles: ['admin', 'editor'] }
      }
    ]
  },

  {
    id: '64',
    path: 'external-link',
    component: 'layout/Layout',
    meta: {
      roles: ['admin', 'editor']
    },
    children: [
      {
        id: '65',
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'externalLink', icon: 'link', roles: ['admin', 'editor'] }
      }
    ]
  }
]

export default {
  getAsyncRoutesMap() {
    return asyncRoutesMap
  }
}
