const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  {
    url: '/login/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      return userMap[username]
    }
  },
  {
    url: '/login/logout',
    type: 'post',
    response: _ => {
      return {
        data: 'success'
      }
    }
  },
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      if (userMap[token]) {
        return userMap[token]
      } else {
        return false
      }
    }
  }
]
