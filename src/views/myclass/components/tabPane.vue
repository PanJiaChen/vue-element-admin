<template>
  <div id="app">
    <complexTable ref="complexTable" :type="false" :table-height="600 + 'px'" :class-id="classId" @listenToChildEvent="getTotalStu"/>
    <div>
      <el-tag>班主任 ：{{ teacherName }}</el-tag>
    </div>
  </div>
</template>

<script>
import complexTable from '@/views/student/complexTable'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    complexTable
  },
  props: {
    classId: {
      type: Number,
      default: undefined
    },
    teacherName: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      total: null,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions: [
        { key: '1', display_name: '县外' },
        { key: '2', display_name: '镇外' },
        { key: '3', display_name: '凉森村' },
        { key: '4', display_name: '跃进村' }
      ],
      listQuery: {
        classId: this.classId,
        fid: this.$store.state.user.fid,
        sort: '+id'
      },
      loading: false
    }
  },
  created() {
    // this.getList()
  },
  methods: {
    getTotalStu: function(data) {
      this.total = data
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
    }
  }
}
</script>

