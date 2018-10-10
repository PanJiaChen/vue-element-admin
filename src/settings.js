export default {
  /**
   * @type {string} en | zh
   * @description User first visited, default language
   */
  language: 'en',

  /**
   * @type {string} medium | small | mini
   * @description User first visited, default size
   */
  size: 'medium',

  /**
   * @type {string} hash | history
   * @description vue-router mode
   */
  routerMode: 'hash',

  /**
   * @type {string} fade-transform | fade
   * @description Page transition animation
   */
  viewsTransition: 'fade-transform',

  /**
   * @type {boolean} true | false
   * @description Need tagsView
   */
  tagsView: true,

  /**
   * @type {string | array} 'production' | ['production','development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to use it in dev, you can pass ['production','development']
   */
  errorLog: 'production',

  /**
   * @type {array} ['/login', '/auth-redirect']
   * @description Set some pages, you can go in without logging in.
   * Detail logic in permission.js
   */
  whiteList: ['/login', '/auth-redirect'],

  /**
   * @type {boolean} true | false
   * @description Whether only one sub-menu can be active
   */
  sidebarUniqueOpened: false

  // permission: true,
  // i18n: true
  // tagsView: true,
  // viewTransition: 'fade-transform', // options:['fade-transform','fade']
}
