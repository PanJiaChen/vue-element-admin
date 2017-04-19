<template>
  <div class="errPage-container">
    aaa
  </div>
</template>
<script>
import { getList } from 'api/article'
export default {
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        area: undefined,
        department: undefined
      }
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        console.log(response)
        const data = response.data;
        this.list = data.items;
        this.total = data.item_count;
        this.listLoading = false;
      })
    }
  }
};
</script>
