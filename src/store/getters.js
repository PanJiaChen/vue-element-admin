const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  toggleSideBar: state => state.app.sidebar.opened,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  corporateBrandingImage: state => state.user.corporateBrandingImage,
  name: state => state.user.name,
  router: state => state.permission.addRoutes,
  introduction: state => state.user.introduction,
  currentRole: state => state.user.currentRole,
  getRoleUuid: state => state.user.role.uuid,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
