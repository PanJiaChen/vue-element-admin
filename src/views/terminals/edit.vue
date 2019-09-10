<template>
  <terminal-detail :is-edit="true" />
</template>

<script>
import TerminalDetail from './components/TerminalDetail'

export default {
  name: 'EditForm',
  components: { TerminalDetail }
}
</script>

