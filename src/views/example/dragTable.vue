<template>
  <div class="app-container calendar-list-container">

    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="序号" width="65">
        <template scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="时间">
        <template scope="scope">
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="作者">
        <template scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" label="重要性">
        <template scope="scope">
          <wscn-icon-svg v-for="n in +scope.row.importance" icon-class="wujiaoxing" class="meta-item__icon" :key="n" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="阅读数" width="95">
        <template scope="scope">
          <span>{{scope.row.pageviews}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="90">
        <template scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="拖拽" width="95">
        <template scope="scope">
          <wscn-icon-svg class='drag-handler' icon-class="tuozhuai" />
        </template>
      </el-table-column>

    </el-table>

    <div class='show-d'>默认顺序  &nbsp;  {{ olderList}}</div>
    <div class='show-d'>拖拽后顺序{{newList}}</div>

  </div>
</template>

<script>
    import { fetchList } from 'api/article_table';
    import Sortable from 'sortablejs'

    export default {
      name: 'drag-table_demo',
      data() {
        return {
          list: null,
          total: null,
          listLoading: true,
          listQuery: {
            page: 1,
            limit: 10
          },
          sortable: null,
          olderList: [],
          newList: []
        }
      },
      created() {
        this.getList();
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: 'success',
            draft: 'gray',
            deleted: 'danger'
          };
          return statusMap[status]
        }
      },
      methods: {
        getList() {
          this.listLoading = true;
          fetchList(this.listQuery).then(response => {
            this.list = response.data.items;
            this.total = response.data.total;
            this.listLoading = false;
            this.olderList = this.list.map(v => v.id);
            this.newList = this.olderList.slice();
            this.$nextTick(() => {
              this.setSort()
            })
          })
        },
        setSort() {
          const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
          this.sortable = Sortable.create(el, {
          // handle: '.drag-handler',
            onEnd: evt => {
              const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
              this.newList.splice(evt.newIndex, 0, tempIndex);
            }
          });
        }
      }
    }
</script>

<style >
.drag-handler{
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.show-d{
  margin-top: 15px;
}
</style>
