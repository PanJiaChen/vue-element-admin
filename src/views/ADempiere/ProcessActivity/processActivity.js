// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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

import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

export default defineComponent({
  name: 'ProcessActivity',

  setup(props, { root }) {
    const processActivity = ref([])
    const recordCount = ref(0)
    const pageToken = ref('')
    const pageSize = ref(50)

    // process local is running
    const getterAllInExecution = computed(() => {
      return root.$store.getters.getAllInExecution
    })

    // process local and send with response
    const getterAllFinishProcess = computed(() => {
      return root.$store.getters.getAllFinishProcess
    })

    // session process from server
    const getterAllSessionProcess = computed(() => {
      return root.$store.getters.getAllSessionProcess
    })

    // all process
    const getRunProcessAll = computed(() => {
      const processAll = [].concat(
        getterAllInExecution.value,
        getterAllFinishProcess.value,
        getterAllSessionProcess.value
      )
      const processAllReturned = []

      processAll.forEach(element => {
        const processMetadataReturned = {}
        let infoMetadata = getProcessMetadata(element.processUuid)
        if (!infoMetadata) {
          infoMetadata = {}
        }

        Object.assign(processMetadataReturned, element, infoMetadata)
        processMetadataReturned.parametersList = element.parametersList
        const indexRepeat = processAllReturned.findIndex(item => {
          return item.instanceUuid === element.instanceUuid && !root.isEmptyValue(element.instanceUuid)
        })

        if (indexRepeat > -1) {
          // update attributes in exists process to return
          // Object.assign(processAllReturned[indexRepeat], processMetadataReturned)
          const other = Object.assign(processMetadataReturned, processAllReturned[indexRepeat])
          processAllReturned[indexRepeat] = other
          return
        }

        // add new process to show
        processAllReturned.push(processMetadataReturned)
      })

      return processAllReturned.sort((a, b) => {
        // sort by most recently date
        return new Date(b.lastRun) - new Date(a.lastRun)
      })
    })

    const getProcessLog = computed(() => {
      return getRunProcessAll.value.filter(element => {
        const { isError, isProcessing } = element
        if (!root.isEmptyValue(isError) && !root.isEmptyValue(isProcessing)) {
          return element
        }
      })
    })

    const language = computed(() => {
      return root.$store.getters.language
    })

    const permissionRoutes = computed(() => {
      return root.$store.getters.permission_routes
    })

    onMounted(() => {
      root.$store.dispatch('getSessionProcessFromServer', {
        pageToken: pageToken.value,
        pageSize: pageSize.value
      })
        .then(response => {
          pageToken.value = response.nextPageToken
        })
    })

    const getProcessMetadata = (uuid) => {
      return root.$store.getters.getProcess(uuid)
    }

    const handleCommand = (activity) => {
      if (activity.command === 'seeReport') {
        root.$router.push({
          name: 'Report Viewer',
          params: {
            processId: activity.processId,
            instanceUuid: activity.instanceUuid,
            fileName: activity.output.fileName
          }
        }, () => {})
      } else if (activity.command === 'zoomIn') {
        const viewSearch = recursiveTreeSearch({
          treeData: permissionRoutes.value,
          attributeValue: activity.uuid,
          attributeName: 'meta',
          secondAttribute: 'uuid',
          attributeChilds: 'children'
        })

        if (viewSearch) {
          root.$router.push({
            name: viewSearch.name,
            query: {
              ...root.$route.query,
              ...activity.parametersList
            }
          }, () => {})
        }
      }
    }

    const checkStatus = ({ isError, isProcessing, isReport }) => {
      const status = {
        text: root.$t('notifications.completed'),
        type: 'success',
        color: '#67C23A'
      }
      // is executing
      if (isProcessing) {
        status.text = root.$t('notifications.processing')
        status.type = 'info'
        status.color = '#909399'
        return status
      }
      // is with error
      if (isError) {
        status.text = root.$t('notifications.error')
        status.type = 'danger'
        status.color = '#F56C6C'
        return status
      }
      // is completed
      return status
    }

    const generateTitle = (title) => {
      const hasKey = root.$te('table.ProcessActivity.' + title)
      if (hasKey) {
        // $t : this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = root.$t('table.ProcessActivity.' + title)
        return translatedTitle
      }
      return title
    }

    const translateDate = (value) => {
      return root.$d(new Date(value), 'long', language.value)
    }

    return {
      processActivity,
      recordCount,
      pageToken,
      pageSize,
      // computeds
      getRunProcessAll,
      getProcessLog,
      language,
      permissionRoutes,
      // methods
      getProcessMetadata,
      handleCommand,
      checkStatus,
      generateTitle,
      translateDate
    }
  }
})
