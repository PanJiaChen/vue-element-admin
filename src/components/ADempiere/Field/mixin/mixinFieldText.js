export default {
  methods: {
    parseValue(value) {
      if (this.isEmptyValue(value)) {
        value = ''
      }
      return String(value)
    }
  }
}
