<template>
  <div id="codefund" />
</template>

<script>
import load from './load'

export default {
  data() {
    return {
      loadSuccess: true
    }
  },
  watch: {
    '$route.path': {
      handler: function(val, oldVal) {
        this.getCodefund()
      }
    }
  },
  mounted() {
    this.getCodefund()
  },
  methods: {
    getCodefund() {
      if (this.$isServer) return
      const codefundId = this.isGitee()
        ? '111'
        : '96'
      const template = 'horizontal'
      load(`https://app.codefund.io/properties/${codefundId}/funder.js?template=${template}`)
    },
    isGitee() {
      const origin = window.location.origin
      if (origin.includes('gitee.io')) {
        return true
      }
      return false
    },
    loadError(oError) {
      this.loadSuccess = false
    }
  }
}
</script>

<style lang="scss">
.cf-wrapper {
  margin: 0 !important;
}
 .fixed-header+#codefund {
    margin-top: 50px;
  }
.hasTagsView {
  .fixed-header+#codefund {
    margin-top: 84px;
  }
}

</style>
