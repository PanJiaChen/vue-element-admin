<template>
  <product-detail :is-edit="true" />
</template>

<script>
import ProductDetail from './components/ProductDetail'

export default {
  name: 'EditForm',
  components: { ProductDetail }
}
</script>

