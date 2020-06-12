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
