
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: Object,
      required: true
    }
  },
  methods: {
    linkProps(route) {
      if (isExternal(route.path)) {
        return {
          is: 'a',
          href: route.path,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: { name: route.name }
      }
    }
  }
}
</script>
