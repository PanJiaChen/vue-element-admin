import { enrollmentUser, forgotPassword, resetPasswordFromToken } from '@/api/ADempiere/enrollment'
import { showMessage } from '@/utils/ADempiere/notification'
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
      return enrollmentUser({
        name: userData.name,
        userName: userData.userName,
        password: userData.password
      })
        .then(() => {
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
          console.warn(`Enrollment User - Error ${error.code}: ${error.message}`)
        })
    },
    /**
     * @param {string} eMailOrUserName
     */
    forgotPassword({ commit }, eMailOrUserName) {
      return forgotPassword(eMailOrUserName)
        .then(forgotPasswordResponse => {
          if (forgotPasswordResponse.responseTypeStatus === 'OK') {
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
          return forgotPasswordResponse
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Forgot Password - Error ${error.code}: ${error.message}`)
        })
    },
    /**
     * TODO: Add support gRPC service createPassword
     * Create password to new user from token
     * @param {string} parameters.token
     * @param {string} parameters.password
     */
    createPasswordFromToken({ commit }, {
      token,
      password
    }) {
      return resetPasswordFromToken({
        token: token,
        password: password
      })
        .then(createPasswordResponse => {
          if (createPasswordResponse.responseTypeStatus === 'OK') {
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

          return createPasswordResponse
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Create Password - Error ${error.code}: ${error.message}`)
        })
    },
    /**
     * @param {string} parameters.token
     * @param {string} parameters.password
     */
    resetPasswordFromToken({ commit }, {
      token,
      password
    }) {
      return resetPasswordFromToken({
        token: token,
        password: password
      })
        .then(resetPasswordResponse => {
          if (resetPasswordResponse.responseTypeStatus === 'OK') {
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

          return resetPasswordResponse
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Reset Password - Error ${error.code}: ${error.message}`)
        })
    }
  }
}

export default enrollment
