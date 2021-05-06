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

import { getRecordAccess, setRecordAccess } from '@/api/ADempiere/actions/record-access.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'
export default {
  name: 'MixinRecordAccess',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    order: {
      type: String,
      default: undefined
    },
    included: {
      type: String,
      default: undefined
    },
    keyColumn: {
      type: String,
      default: undefined
    },
    identifiersList: {
      type: Array,
      default: undefined
    },
    record: {
      type: Object,
      default: () => {}
    },
    tableName: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      group: 'sequence',
      isReadonly: false,
      isDependentEntities: true,
      recordAccess: {
        recordUuid: '',
        roles: []
      }
    }
  },
  computed: {
    excludedList: {
      get() {
        if (this.recordAccess.roles) {
          return this.recordAccess.roles.filter(role => !role.isRoleConfig)
        } else {
          return []
        }
      },
      set(value) {
      }
    },
    includedList: {
      get() {
        if (this.recordAccess.roles) {
          return this.recordAccess.roles.filter(role => role.isRoleConfig)
        } else {
          return []
        }
      },
      set(value) {
      }
    },
    getIdentifiersList() {
      return this.identifiersList
        .filter(item => item.componentPath !== 'FieldSelect')
    }
  },
  created() {
    getRecordAccess({
      tableName: this.tableName,
      recordId: this.record[this.tableName + '_ID'],
      recordUuid: this.record.UUID
    })
      .then(access => {
        this.recordAccess.tableName = access.tableName
        this.recordAccess.recordId = access.recordId
        this.recordAccess.recordUuid = access.recordUuid
        access.availableRoles.forEach(role => {
          this.recordAccess.roles.push({
            ...role,
            isRoleConfig: false,
            isLocked: role.isExclude
          })
        })
        access.currentRoles.forEach(role => {
          this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId).isLocked = role.isExclude
          this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId).isRoleConfig = true
          this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId).isDependentEntities = role.isDependentEntities
          this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId).isReadOnly = role.isReadOnly
          this.recordAccess.roles.find(availableRole => availableRole.roleId === role.roleId).isExclude = role.isExclude
        })
      })
  },
  methods: {
    handleChange(value) {
      const action = Object.keys(value)[0] // get property
      const element = value[action].element
      const index = this.recordAccess.roles.findIndex(role => role.roleId === element.roleId)
      switch (action) {
        case 'added':
          this.addItem({
            index,
            element
          })
          break
        case 'removed':
          this.deleteItem({
            index,
            element
          })
          break
      }
    },
    /**
     * @param {number} index: the index of the added element
     * @param {object} element: the added element
     */
    addItem({
      index,
      element
    }) {
      this.recordAccess.roles[index].isRoleConfig = true
    },
    /**
     * @param {number} index: the index of the element before remove
     * @param {object} element: the removed element
     */
    deleteItem({
      index,
      element
    }) {
      this.recordAccess.roles[index].isRoleConfig = false
    },
    getOrder(arrayToSort, orderBy = this.order) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    },
    saveRecordAccess(recordAccesses) {
      setRecordAccess({
        tableName: this.tableName,
        recordId: this.record[this.tableName + '_ID'],
        recordUuid: this.record.UUID,
        recordAccesses
      })
        .then(response => {
          showMessage({
            message: language.t('grid.recordAccess.accessGranted')
          })
          this.close()
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    },
    validateList(list) {
      list.forEach(element => {
        if (element.isExclude) {
          element.isReadOnly = false
        } else {
          element.isDependentEntities = false
        }
      })
      return list
    },
    close() {
      this.$store.dispatch('setShowDialog', {
        type: 'window',
        action: undefined
      })
      this.$router.push({
        name: this.$route.name,
        query: {
          ...this.$route.query,
          typeAction: ''
        }
      }, () => {})
      this.$store.commit('setRecordAccess', false)
      this.$store.commit('changeShowRigthPanel', false)
    }
  }
}
