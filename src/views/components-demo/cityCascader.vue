<template>
  <div class="components-container">
    <code>{{ $t('components.cityCascaderTips') }}</code>
    <city-cascader />
  </div>
</template>

<script>
import CityCascader from '@/components/CityCascader'
export default {
  components: {
    CityCascader
  },
  data() {
    return {}
  }
}
</script>
