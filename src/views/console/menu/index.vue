<template>
  <div class="app-container">
    this is {{ token() }} menus
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  methods: {
    ...mapGetters([
      'token'
    ])
  }

}
</script>
