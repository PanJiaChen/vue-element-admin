
export default {
  name: 'RelationsMixin',
  computed: {
    relationsList() {
      let menuUuid = this.$route.params.menuParentUuid
      if (this.isEmptyValue(menuUuid)) {
        menuUuid = this.menuParentUuid
      }
      const relations = this.$store.getters.getRelations(menuUuid)

      if (!this.isEmptyValue(relations.children)) {
        return relations.children
      }
      if (relations.meta && !this.isEmptyValue(relations.meta.childs)) {
        return relations.meta.childs
      }
      return []
    },
    isEmptyChilds() {
      const childs = this.relationsList
      const len = childs.length
      if (len < 1) {
        return true
      }
      if (len === 1) {
        // diferent to current view
        return childs[0].meta.uuid === this.$route.meta.uuid
      }
      return false
    }
  },
  methods: {
    getChilds(item) {
      if (!this.isEmptyValue(item.children)) {
        return item.children
      }
      if (item.meta && !this.isEmptyValue(item.meta.childs)) {
        return item.meta.childs
      }
      return []
    }
  }
}
