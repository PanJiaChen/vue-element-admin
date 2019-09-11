<template>
  <faq-detail :is-edit="false" />
</template>

<script>
import FaqDetail from './components/FaqDetail'

export default {
  name: 'CreateForm',
  components: { FaqDetail }
}
</script>

