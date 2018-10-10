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
  tagsView: true

  // permission: true,
  // i18n: true
  // tagsView: true,
  // viewTransition: 'fade-transform', // options:['fade-transform','fade']
}
