export default {
  name: 'MixinContainerInfo',
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    }
  }
}
