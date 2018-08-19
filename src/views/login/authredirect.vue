<script>
export default {
  name: 'Authredirect',
  created() {
    const hash = window.location.search.slice(1)
    window.opener.location.href = window.location.origin + '/login#' + hash
    window.close()
  }
}
</script>
