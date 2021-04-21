<template>
  <component
    :is="templateDevice"
  />
</template>

<script>
export default {
  name: 'RecordAccess',
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
