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
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :metadata="metadata"
    :group-tab="groupTab"
    :panel-type="panelType"
    :is-advanced-query="isAdvancedQuery"
    :is-showed-record-navigation="isShowedRecordNavigation"
  />
</template>

<script>
export default {
  name: 'MainPanel',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    metadata: {
      type: Object,
      default: () => {}
    },
    // tab type group
    groupTab: {
      type: Object,
      default: () => ({
        groupType: '',
        groupName: ''
      })
    },
    panelType: {
      type: String,
      default: 'window'
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    },
    isShowedRecordNavigation: {
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
        return () => import('@/components/ADempiere/Panel/mainPanelMobile')
      }
      return () => import('@/components/ADempiere/Panel/mainPanelDesktop')
    }
  }
}
</script>

<style>
  .select-filter {
    width: 280px !important;
    float: right;
    top: 0;
  }
  .select-filter-header {
    width: 60% !important;
    float: right;
    top: 0px;
  }
</style>
