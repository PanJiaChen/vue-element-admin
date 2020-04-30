<template>
  <component
    :is="componentRender"
    :metadata="metadata"
  />
</template>

<script>
export default {
  name: 'FormPanel',
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  computed: {
    // load the component that is indicated in the attributes of received property
    componentRender() {
      let form
      switch (this.metadata.fileName) {
        case 'PriceChecking':
          form = import('@/components/ADempiere/Form/PriceChecking')
          break
      }

      return () => {
        return new Promise(resolve => {
          form
            .then(formFile => {
              resolve(formFile)
            })
            .catch(() => {
              import('@/views/ADempiere/Unsupported')
                .then(unsupportedFile => {
                  resolve(unsupportedFile)
                })
            })
        })
      }
    }
  }
}
</script>
