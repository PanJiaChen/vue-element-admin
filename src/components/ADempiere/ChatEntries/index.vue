<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <component
    :is="templateDevice"
    :right-panel="rightPanel"
    :table-name="tableName"
    :record-id="recordId"
  />
</template>

<script>
import inputChat from './inputChat'

export default {
  name: 'ChatEntries',
  components: {
    inputChat
  },
  props: {
    tableName: {
      type: String,
      default: undefined
    },
    recordId: {
      type: Number,
      default: undefined
    },
    rightPanel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    templateDevice() {
      if (this.isMobile) {
        return () => import('@/components/ADempiere/ChatEntries/modeMobile.vue')
      }
      return () => import('@/components/ADempiere/ChatEntries/modeDesktop.vue')
    }
  }
}
</script>
