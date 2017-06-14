<template>
  <div class="components-container">
    <code>drag-list base on <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a></code>
    <div class="editor-container">
       <DndList :list1="list1" :list2="list2" list1Title="头条列表" list2Title="文章池" />
    </div>
  </div>
</template>
<script>
    import DndList from 'components/twoDndList'
    import { getList } from 'api/article';
    export default {
      components: { DndList },
      data() {
        return {
          list1: [],
          list2: []
        }
      },
      created() {
        this.fetchData();
      },
      methods: {
        fetchData() {
          this.listLoading = true;
          getList(this.listQuery).then(response => {
            this.list1 = response.data.splice(0, 5);
            this.list2 = response.data;
            console.log(this.list1, this.list2)
          })
        }
      }
    };
</script>


