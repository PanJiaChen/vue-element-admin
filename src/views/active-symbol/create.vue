<template>
  <active-symbol-detail :is-edit="false" />
</template>

<script>
import ActiveSymbolDetail from './components/ActiveSymbolDetail'

export default {
  name: 'CreateForm',
  components: { ActiveSymbolDetail }
}
</script>
