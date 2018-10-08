<template>
  <div id="codefund_ad"/>
</template>

<script>
export default {
  data() {
    return {
      loadSuccess: true
    }
  },
  watch: {
    '$route.path': {
      handler: function(val, oldVal) {
        window._codefund.serve()
      }
    }
  },
  mounted() {
    this.addFundScript()
  },
  methods: {
    addFundScript() {
      if (this.$isServer) return
      const codefundId = this.isGitee()
        ? 'c0e8a6c2-6717-402f-aea7-bfdcaaaf2329'
        : 'c010d89c-46a8-4e3a-abf0-86b8a02874e4'
      const script = window.document.createElement('script')
      const template = 'horizontal'
      script.onerror = this.loadError
      script.src = `https://codefund.io/scripts/${codefundId}/embed.js?template=${template}`
      document.body.appendChild(script)
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

<style>
.cf-wrapper{
  margin: 12px 0 0!important;
}
</style>
