<template>
  <faq-detail :is-edit="true" />
</template>

<script>
import FaqDetail from './components/FaqDetail'

export default {
  name: 'EditForm',
  components: { FaqDetail }
}
</script>

