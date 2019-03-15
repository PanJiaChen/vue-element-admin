const menuData =
[
  {
    'id': 1,
    'path': '/console',
    'redirect': 'noredirect',
    'component': 'Layout',
    'name': 'console',
    'title': '系统管理',
    'icon': 'component',
    'parentId': -1,
    'children': [
      {
        'children': [],
        'name': 'user',
        'component': 'console/user/index',
        'id': 7,
        'title': '用户管理',
        'icon': 'user',
        'parentId': 1,
        'path': 'user'
      },
      {
        'children': [],
        'name': 'menu',
        'component': 'console/menu/index',
        'id': 8,
        'title': '菜单管理',
        'icon': 'documentation',
        'parentId': 1,
        'path': 'menu'
      },
      {
        'children': [],
        'name': 'role',
        'component': 'console/role/index',
        'id': 9,
        'title': '角色管理',
        'icon': 'documentation',
        'parentId': 1,
        'path': 'role'
      },
      {
        'children': [],
        'name': 'dict',
        'component': 'console/dict/index',
        'id': 10,
        'title': '字典管理',
        'icon': 'documentation',
        'parentId': 1,
        'path': 'dict'
      },
      {
        'children': [],
        'name': 'dept',
        'component': 'console/dept/index',
        'id': 11,
        'title': '部门管理',
        'icon': 'documentation',
        'parentId': 1,
        'path': 'dept'
      }
    ]
  }

]

export default {
  getMenuByRole: config => {
    return menuData
  }
}
