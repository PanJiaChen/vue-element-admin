import request from '@/utils/request'

export function login_mobile(mobile, pwd, rememberMe, imgcode, k) {
  return request({
    url: '/login/mobile',
    method: 'post',
    data: {
      mobile,
      pwd,
      rememberMe,
      imgcode,
      k
    }
  })
}

export function smscode_register(mobile, code, k) {
  return request({
    url: '/register/smscode',
    method: 'post',
    data: {
      mobile,
      code,
      k
    }
  })
}

export function register(mobile, pwd, smsCode, name, referrer) {
  return request({
    url: '/register/save',
    method: 'post',
    data: {
      mobile,
      pwd,
      smsCode,
      name,
      referrer
    }
  })
}

export function smscode_resetpwd(mobile, code, k) {
  return request({
    url: '/forgetPassword/smscode',
    method: 'post',
    data: {
      mobile,
      code,
      k
    }
  })
}

export function resetpwd(mobile, pwd, smsCode) {
  return request({
    url: '/forgetPassword/resetPwd',
    method: 'post',
    data: {
      mobile,
      pwd,
      smsCode
    }
  })
}

export function editPwd(oldPwd, newPwd) {
  return request({
    url: '/user/editPwd/save',
    method: 'post',
    data: {
      oldPwd,
      newPwd
    }
  })
}

export function checkToken() {
  return request({
    url: '/user/checkToken',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/login/exit',
    method: 'get'
  })
}
