<template>
  <div class="components-container">
    <code>drag-list base on <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a></code>
    <div class="editor-container">
       <dnd-list :list1="list1" :list2="list2" list1Title="头条列表" list2Title="文章池"></dnd-list>
    </div>
  </div>
</template>

<script>
import DndList from '@/components/twoDndList'
import { fetchList } from '@/api/article'

export default {
  components: { DndList },
  data() {
    return {
      list1: [],
      list2: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      fetchList().then(response => {
        this.list1 = response.data.items.splice(0, 5)
        this.list2 = response.data.items
      })
    }
  }
}
</script>


