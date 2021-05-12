// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'

const clientVersion = '1.0.0'
const applicationType = 'ADempiere-Vue'

/**
 * enroll User
 * @param {string} userData.name
 * @param {string} userData.userName
 * @param {string} userData.password
 */
export function requestEnrollUser({
  name,
  userName,
  password,
  eMail
}) {
  return request({
    url: '/user/enrollment/enroll',
    data: {
      user_name: userName,
      name,
      email: eMail,
      password,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(enrollResponse => {
      return {
        userName: enrollResponse.user_name,
        name: enrollResponse.name,
        eMail: enrollResponse.email
      }
    })
}

/**
 * Request from forgot password
 * @param {string} eMailOrUserName
 */
export function requestForgotPassword(eMailOrUserName) {
  let userName, eMail
  if (String(eMailOrUserName).includes('@')) {
    eMail = eMailOrUserName
  } else {
    userName = eMailOrUserName
  }

  return request({
    url: '/user/enrollment/reset-password',
    data: {
      user_name: userName,
      email: eMail,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(forgotResponse => {
      return {
        responseType: forgotResponse.response_type,
        responseTypeStatus: forgotResponse.response_type_status
      }
    })
}

/**
 * Request from reset password with token
 * @param {string} token
 * @param {string} password
 */
export function requestChangePassword({
  token,
  password
}) {
  return request({
    url: '/user/enrollment/change-password',
    data: {
      token,
      password,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(changePasswordResponse => {
      return {
        responseType: changePasswordResponse.response_type,
        responseTypeStatus: changePasswordResponse.response_type_status
      }
    })
}

/**
 * Request from reset password with token
 * @param {string} token
 * @param {string} password
 */
export function requestActivateUser({
  token
}) {
  return request({
    url: '/user/enrollment/activate-user',
    data: {
      token,
      client_version: clientVersion,
      application_type: applicationType
    }
  })
    .then(activateUserResponse => {
      return {
        responseType: activateUserResponse.response_type,
        responseTypeStatus: activateUserResponse.response_type_status
      }
    })
}
