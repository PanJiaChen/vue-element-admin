const permission = {
  state: {
    permissionRoutes: []
  },
  init(data) {
    const { roles, router } = data;
    const permissionRoutes = router.filter(v => {
      if (roles.indexOf('admin') >= 0) return true;
      if (this.hasPermission(roles, v)) {
        if (v.children && v.children.length > 0) {
          v.children = v.children.filter(child => {
            if (this.hasPermission(roles, child)) {
              return child
            }
            return false;
          });
          return v
        } else {
          return v
        }
      }
      return false;
    });
    this.state.permissionRoutes = permissionRoutes;
  },
  get() {
    return this.state.permissionRoutes
  },
  hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
      return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
      return true
    }
  }
};

export default permission;
