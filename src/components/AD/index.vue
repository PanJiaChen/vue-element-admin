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
        window._codefund && window._codefund.serve()
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
        ? '4d3a53de-d23e-4286-94c7-e5a57ad69d26'
        : '696d21c7-a78e-4437-b738-3967c5a57693'
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
  margin: 0!important;
}
</style>
