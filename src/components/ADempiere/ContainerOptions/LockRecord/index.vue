<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <span v-if="isFirstTab" key="withTooltip">
    <el-tooltip
      v-if="isFirstTab"
      :content="isLocked ? $t('data.lockRecord') : $t('data.unlockRecord')"
      placement="top"
    >
      <el-button type="text" @click="lockRecord()">
        <i
          :class="isLocked ? 'el-icon-lock' : 'el-icon-unlock'"
          style="font-size: 15px; color: black;"
        />
      </el-button>
    </el-tooltip>

    <span :style="isLocked ? 'color: red;' :'color: #1890ff;'">
      {{ tabName }}
    </span>
  </span>

  <span v-else key="onlyName">
    {{ tabName }}
  </span>
</template>

<script>
import { defineComponent, computed, ref, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'LockRecord',

  props: {
    tabUuid: {
      type: String,
      required: true
    },
    tabPosition: {
      type: Number,
      default: 0
    },
    tabName: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    }
  },

  setup(props, { root }) {
    const containerUuid = props.tabUuid
    const tableName = props.tableName

    const isFirstTab = computed(() => {
      return props.tabPosition === 0
    })

    const isLocked = ref(false)

    const isValidUuid = (recordUuid) => {
      return !root.isEmptyValue(recordUuid) && recordUuid !== 'create-new'
    }

    const lockRecord = () => {
      const action = isLocked.value ? 'unlockRecord' : 'lockRecord'
      const { recordId, recordUuid } = getRecordId()

      root.$store.dispatch(action, {
        tableName,
        recordId,
        recordUuid
      })
        .then(() => {
          root.$message({
            type: 'success',
            message: root.$t('data.notification.' + action),
            showClose: true
          })
        })
        .catch(() => {
          root.$message({
            type: 'error',
            message: root.$t('data.isError') + root.$t('data.' + action),
            showClose: true
          })
        })
        .finally(() => {
          getPrivateAccess()
        })
    }

    const record = computed(() => {
      if (isFirstTab) {
        const recordUuid = root.$route.query.action
        if (isValidUuid(recordUuid)) {
          return root.$store.getters.getRowData({
            containerUuid,
            recordUuid
          })
        }
      }

      return undefined
    })

    const getRecordId = () => {
      let recordId
      let recordUuid
      const recordRow = record.value
      if (!root.isEmptyValue(recordRow)) {
        recordId = recordRow[tableName + '_ID']
        recordUuid = recordRow.UUID
      } else {
        if (isValidUuid(root.$route.query.action)) {
          recordUuid = root.$route.query.action
        }
      }

      return {
        recordId,
        recordUuid
      }
    }

    const getPrivateAccess = () => {
      const { recordId, recordUuid } = getRecordId()

      root.$store.dispatch('getPrivateAccessFromServer', {
        tableName,
        recordId,
        recordUuid
      })
        .then(privateAccessResponse => {
          if (!root.isEmptyValue(privateAccessResponse)) {
            isLocked.value = privateAccessResponse.isLocked
          } else {
            isLocked.value = false
          }
        })
    }

    watch(() => root.$route.query.action, (newValue) => {
      if (isValidUuid(newValue)) {
        getPrivateAccess()
      }
    })

    return {
      isLocked,
      // computed
      isFirstTab,
      // methods
      lockRecord
    }
  }
})
</script>
