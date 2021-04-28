<template>
  <component
    :is="templateDevice"
    :record="record"
    :table-name="tableName"
  />
</template>

<script>
export default {
  name: 'RecordAccess',
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    tableName: {
      type: String,
      default: undefined
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    templateDevice() {
      if (this.isMobile) {
        return () => import('@/components/ADempiere/RecordAccess/recordAccessMobile')
      }
      return () => import('@/components/ADempiere/RecordAccess/recordAccessDesktop')
    }
  }
}
</script>
