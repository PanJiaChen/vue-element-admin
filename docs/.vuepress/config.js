var nav = require('./nav.js')
var { EcosystemNav, ComponentNav, BackendNav } = nav

var utils = require('./utils.js')
var { genNav, getComponentSidebar, deepClone } = utils

module.exports = {
  title: 'adempiere-vue',
  description: 'The new UI for ADempiere ERP',
  base: '/adempiere-vue/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    repo: 'adempiere/adempiere-vue',
    docsRepo: 'adempiere/adempiere-vue',
    docsDir: 'docs',
    editLinks: true,
    sidebarDepth: 3,
    algolia: {
      apiKey: 'ffce0083d0830de5f562c045a481410b',
      indexName: 'vue_element_admin'
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Features',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'EN')
          },
          {
            text: 'Ecosystem',
            items: genNav(deepClone(EcosystemNav), 'EN')
          },
          {
            text: 'Donate',
            link: '/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          }
        ],
        sidebar: {
          '/guide/': [
            {
              title: 'Essentials',
              collapsable: false,
              children: genEssentialsSidebar()
            },
            {
              title: 'Advanced',
              collapsable: false,
              children: genAdvancedSidebar()
            },
            {
              title: 'Components',
              collapsable: false,
              children: genComponentSidebar()
            },
            {
              title: 'Other',
              collapsable: false,
              children: [
                '/guide/other/gitter.md',
                '/guide/other/release-notes.md'
              ]
            }
          ],
          '/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'EN'
          ),
          '/feature/script/': [
            '/feature/script/svgo.md',
            '/feature/script/new.md'
          ]
        }
      },
      '/es/': {
        label: 'Español',
        selectText: 'Idiomas',
        editLinkText: 'Editar esta página en GitHub',
        nav: [
          {
            text: 'Guía',
            link: '/es/guide/'
          },
          {
            text: 'Características',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ES')
          },
          {
            text: 'Ecosistema',
            items: genNav(deepClone(EcosystemNav), 'ES')
          },
          {
            text: 'Donar',
            link: '/es/donate/'
          }
        ],
        sidebar: {
          '/es/guide/': [
            {
              title: 'Esenciales',
              collapsable: false,
              children: genEssentialsSidebar('/es')
            },
            {
              title: 'Avanzado',
              collapsable: false,
              children: genAdvancedSidebar('/es')
            },
            {
              title: 'Componentes',
              collapsable: false,
              children: genComponentSidebar()
            },
            {
              title: 'Otro',
              collapsable: false,
              children: [
                '/es/guide/other/gitter.md',
                '/es/guide/other/release-notes.md'
              ]
            }
          ],
          '/es/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ES'
          ),
          '/es/feature/script/': [
            '/es/feature/script/svgo.md',
            '/es/feature/script/new.md'
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/'
          },
          {
            text: '功能',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ZH')
          },
          {
            text: '生态系统',
            items: genNav(deepClone(EcosystemNav), 'ZH')
          },
          {
            text: '捐赠',
            link: '/zh/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          },
          {
            text: '招聘',
            link: '/zh/job/'
          }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              title: '組件',
              collapsable: false,
              children: genEssentialsSidebar('/zh')
            },
            {
              title: '进阶',
              collapsable: false,
              children: genAdvancedSidebar('/zh')
            },
            {
              title: '成分',
              collapsable: false,
              children: genComponentSidebar()
            },
            {
              title: '其它',
              collapsable: false,
              children: [
                '/zh/guide/other/faq.md',
                '/zh/guide/other/release-notes.md'
              ]
            }
          ],
          '/zh/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ZH'
          ),
          '/zh/feature/script/': [
            '/zh/feature/script/svgo.md',
            '/zh/feature/script/new.md'
          ]
        }
      }
    }
  },
  locales: {
    '/': {
      lang: 'en-US',
      description: 'The new UI for ADempiere ERP'
    },
    '/zh/': {
      lang: 'zh-CN',
      description: 'The new UI for ADempiere ERP'
    },
    '/es/': {
      lang: 'es-ES',
      description:
        'La nueva UI para ADempiere ERP, tome su tiempo para ver estamaravillosa interfaz adaptada a los requerimientos de su negocio'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  ga: 'UA-109340118-1'
}

function genEssentialsSidebar(type = '') {
  const mapArr = [
    '/guide/',
    '/guide/essentials/layout.md',
    '/guide/essentials/router-and-nav.md',
    '/guide/essentials/permission.md',
    '/guide/essentials/tags-view.md',
    '/guide/essentials/new-page.md',
    '/guide/essentials/style.md',
    '/guide/essentials/server.md',
    '/guide/essentials/mock-api.md',
    '/guide/essentials/import.md',
    '/guide/essentials/deploy.md',
    '/guide/essentials/env.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genAdvancedSidebar(type = '') {
  const mapArr = [
    '/guide/advanced/cors.md',
    '/guide/advanced/eslint.md',
    '/guide/advanced/git-hook.md',
    '/guide/advanced/style-guide.md',
    '/guide/advanced/lazy-loading.md',
    '/guide/advanced/chart.md',
    '/guide/advanced/icon.md',
    '/guide/advanced/cdn.md',
    '/guide/advanced/theme.md',
    '/guide/advanced/i18n.md',
    '/guide/advanced/error.md',
    '/guide/advanced/webpack.md',
    '/guide/advanced/sass.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genComponentSidebar(type = '') {
  const mapArr = [
    '/guide/components/preference.md',
    '/guide/components/record-access.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}
