// Get Instance for connection
import { EnrollmentInstance as Instance } from '@/api/ADempiere/instances.js'

/**
 * enroll User
 * @param {string} userData.name
 * @param {string} userData.userName
 * @param {string} userData.password
 */
export function enrollmentUser({ name, userName, password, eMail }) {
  return Instance.call(this).enrollUser({
    name,
    userName,
    password,
    eMail
  })
}

/**
 * Request from forgot password
 * @param {string} eMailOrUserName
 */
export function forgotPassword(eMailOrUserName) {
  return Instance.call(this).requestResetPassword(eMailOrUserName)
}

/**
 * Request from reset password with token
 * @param {string} token
 * @param {string} password
 */
export function resetPasswordFromToken({ token, password }) {
  return Instance.call(this).resetPasswordFromToken({ token, password })
}
