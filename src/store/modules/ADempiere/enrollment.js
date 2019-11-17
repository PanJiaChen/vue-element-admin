import { enrollmentUser, forgotPassword, resetPasswordFromToken } from '@/api/ADempiere/enrollment'
import { showMessage } from '@/utils/ADempiere'
import language from '@/lang'
import router from '@/router'

const enrollment = {
  actions: {
    /**
     * Enroll user
     * @param {string} userData.name
     * @param {string} userData.userName
     * @param {string} userData.password
     */
    enrollmentUser({ commit }, userData) {
      return enrollmentUser(userData)
        .then(response => {
          showMessage({
            message: language.t('login.userEnrollmentSuccessful'),
            type: 'success'
          })
          router.push({
            path: 'login'
          })
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn('Enrollment User - Error ' + error.code + ': ' + error.message)
        })
    },
    /**
     * @param {string} eMailOrUserName
     */
    forgotPassword({ commit }, eMailOrUserName) {
      return forgotPassword(eMailOrUserName)
        .then(response => {
          if (response.getResponsetype() === 0) {
            showMessage({
              message: language.t('login.passwordResetSendLink') + eMailOrUserName,
              type: 'success'
            })
            router.push({
              path: 'login'
            })
          } else {
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
          }
          return response
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn('Forgot Password - Error ' + error.code + ': ' + error.message)
        })
    },
    /**
     * TODO: Add support gRPC service createPassword
     * Create password to new user from token
     * @param {string} parameters.token
     * @param {string} parameters.password
     */
    createPasswordFromToken({ commit }, parameters) {
      return resetPasswordFromToken(parameters.token, parameters.password)
        .then(response => {
          if (response.getResponsetype() === 0) {
            showMessage({
              message: language.t('login.createPasswordSuccessful'),
              type: 'success'
            })
          } else {
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
          }
          router.push({
            path: 'login'
          })
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn('Create Password - Error ' + error.code + ': ' + error.message)
        })
    },
    /**
     * @param {string} parameters.token
     * @param {string} parameters.password
     */
    resetPasswordFromToken({ commit }, parameters) {
      return resetPasswordFromToken(parameters.token, parameters.password)
        .then(response => {
          if (response.getResponsetype() === 0) {
            showMessage({
              message: language.t('login.passwordResetSuccessful'),
              type: 'success'
            })
          } else {
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
          }
          router.push({
            path: 'login'
          })
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn('Reset Password - Error ' + error.code + ': ' + error.message)
        })
    }
  }
}

export default enrollment
