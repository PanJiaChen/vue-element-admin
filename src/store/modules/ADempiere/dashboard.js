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
// This file is for get all information for dashboard of ADempiere client,
// please if you want to implement a custom dashboard create a new fielwith api definition
// Default store for handle dashboard refresh and other functionalities
import { requestLisDashboards } from '@/api/ADempiere/dashboard/dashboard'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { getCurrentRole } from '@/utils/auth'

const dashboard = {
  state: {
    dashboard: [],
    recentItems: [],
    mainashboard: {}
  },
  mutations: {
    addDashboard(state, payload) {
      state.dashboard.push(payload)
    },
    notifyDashboardRefresh: (state, payload) => {

    },
    setRecentItems(state, payload) {
      state.recentItems = payload
    },
    setMainDashboard(state, payload) {
      state.mainashboard = payload
    }
  },
  actions: {
    refreshDashboard({ commit }, parameters) {
      commit('notifyDashboardRefresh', parameters)
    },
    listDashboard({ commit, rootGetters }, {
      roleId,
      roleUuid
    }) {
      if (isEmptyValue(roleUuid)) {
        roleUuid = rootGetters.getRoleUuid
        if (isEmptyValue(roleUuid)) {
          roleUuid = getCurrentRole()
        }
      }

      return new Promise(resolve => {
        requestLisDashboards({
          roleId,
          roleUuid
        })
          .then(dashboardResponse => {
            // TODO: verify it with uuid
            const roleDashboards = {
              roleUuid: roleUuid,
              ...dashboardResponse
            }
            commit('addDashboard', roleDashboards)
            resolve(roleDashboards)
          })
          .catch(error => {
            console.warn(`Error getting List Dashboards: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    mainDashboard({ commit }, dashboard) {
      commit('setMainDashboard', dashboard)
    }
  },
  getters: {
    getDashboard: (state) => (dashboardUuid) => {
      return state.dashboard.find(
        item => item.uuid === dashboardUuid
      )
    },
    getDashboardByRole: (state) => (roleUuid) => {
      return state.dashboard.find(
        item => item.roleUuid === roleUuid
      )
    },
    getMainDashboard: (state) => {
      return state.mainashboard
    }
  }
}

export default dashboard
