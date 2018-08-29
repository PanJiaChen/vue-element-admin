<script>
export default {
  beforeCreate() {
    const path = this.$route.params.path
    this.$router.replace('/' + path)
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
