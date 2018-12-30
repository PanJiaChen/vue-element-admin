<template>
  <div id="codefund"/>
</template>

<script>
import axios from 'axios'
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
      axios.get(`https://api.codefund.app/properties/${codefundId}/funder.html?template=${template}`)
        .then(function(response) {
          document.getElementById('codefund').innerHTML = response.data
        })
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
