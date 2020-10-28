import Sortable from 'sortablejs'

export default {
  name: 'MixinTableSort',
  data() {
    return {
      sortable: null
    }
  },
  methods: {
    async getList() {
      this.oldgetDataDetail = this.recordsData.map(v => v.id)
      this.newgetDataDetail = this.oldgetDataDetail.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      if (!this.isMobile) {
        const el = this.$refs.multipleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: dataTransfer => {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.recordsData.splice(evt.oldIndex, 1)[0]
            this.recordsData.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newgetDataDetail.splice(evt.oldIndex, 1)[0]
            this.newgetDataDetail.splice(evt.newIndex, 0, tempIndex)
          }
        })
      }
    }
  }
}
