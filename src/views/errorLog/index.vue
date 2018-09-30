<template>
  <div class="errPage-container">
    <errorA/>
    <errorB/>
    <!-- $t is vue-i18n global function to translate lang -->
    <h3>{{ $t('errorLog.tips') }}</h3>
    <code>
      {{ $t('errorLog.description') }}
      <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/error.html">
        {{ $t('errorLog.documentation') }}
      </a>
    </code>
    <a href="#">
      <img src="https://wpimg.wallstcn.com/360e4842-4db5-42d0-b078-f9a84a825546.gif">
    </a>
  </div>
</template>

<script>
import errorA from './errorTestA'
import errorB from './errorTestB'

export default {
  name: 'ErrorLog',
  components: { errorA, errorB }
}
</script>

<style scoped>
  .errPage-container {
    padding: 30px;
  }
</style>
