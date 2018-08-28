<template>
  <div class="components-container">
    <el-select v-el-drag-select v-model="value" multiple placeholder="请选择">
      <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value"/>
    </el-select>
    {{ value }}
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import elDragSelect from '@/directive/el-dragSelect' // base on element-ui

export default {
  name: 'DragSelectDemo',
  directives: { elDragSelect },
  data() {
    return {
      value: ['黄金糕', '双皮奶'],
      options: [{
        value: '黄金糕',
        label: '黄金糕'
      }, {
        value: '双皮奶',
        label: '双皮奶'
      }, {
        value: '蚵仔煎',
        label: '蚵仔煎'
      }, {
        value: '龙须面',
        label: '龙须面'
      }, {
        value: '北京烤鸭',
        label: '北京烤鸭'
      }]
    }
  },
  mounted() {
    // this.setSort()
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
          // console.log(evt)
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
