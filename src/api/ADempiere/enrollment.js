import Enrollment from '@adempiere/grpc-enrollment-client'
import { ENROLLMENT_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new Enrollment(
    ENROLLMENT_ADDRESS,
    3.9,
    'ADempiere-Vue'
  )
}

/**
 * enroll User
 * @param {string} userData.name
 * @param {string} userData.userName
 * @param {string} userData.password
 */
export function enrollmentUser({ name, userName, password, eMail }) {
  return Instance.call(this).enrollUser({
    name: name,
    userName: userName,
    password: password,
    eMail: eMail
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
