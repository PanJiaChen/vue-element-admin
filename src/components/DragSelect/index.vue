<template>
  <el-select v-model="selectVal" :v-bind="$attrs" multiple>
    <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value" />
  </el-select>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  name: 'DragSelect',
  props: {
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {

    }
  },
  computed: {
    selectVal: {
      get() {
        console.log([...this.value])
        return [...this.value]
      },
      set() {

      }
    }
  },
  watch: {
    value(val) {
      console.log(val)
    }
  },
  mounted() {
    this.setSort()
  },
  methods: {
    setSort() {
      const el = document.querySelectorAll('.el-select__tags > span')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          console.log(evt)
          const targetRow = this.value.splice(evt.oldIndex, 1)[0]
          this.value.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>

<style>
.sortable-ghost{
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
