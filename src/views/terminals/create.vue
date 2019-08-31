<template>
  <terminal-detail :is-edit="false" />
</template>

<script>
import TerminalDetail from './components/TerminalDetail'

export default {
  name: 'CreateForm',
  components: { TerminalDetail }
}
</script>

