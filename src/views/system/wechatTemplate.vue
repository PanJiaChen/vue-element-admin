<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:-10px;">
      <el-button class="filter-item" icon="el-icon-refresh" style="float:right;margin-left:15px;">拉取模板</el-button>
    </div>

    <el-table
      :data="list"
      :show-overflow-tooltip="true"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:300px;ellipsis;margin-top:-10px;">
      <el-table-column :label="$t('table.id')" align="center" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="模板ID" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.templateId }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="模板标题" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="模板格式" min-width="250px" align="center">
        <template slot-scope="scope">
          <span><div v-html="$options.filters.msg(scope.row.content)"/></span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="模板所属应用ID" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appid }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini">编辑用户</el-button>
          <el-button size="mini" type="success" >查看</el-button>
          <el-button size="mini" type="danger" >{{ $t('table.delete') }}</el-button>
          <el-button size="mini" type="success" >禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchTemplateList } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  filters: {
    msg: function(msg) {
      // .replace(/\{[^}]+}}/g, 'abc')
      return msg.replace(/\\n/gm, '<br/>')
    }
  },
  data() {
    return {
      list: null,
      total: null,
      listQuery: {
        fid: this.$store.state.user.fid
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchTemplateList(this.listQuery).then(response => {
        this.list = response.data.result
        this.total = response.data.result.total
      })
    }
  }
}
</script>
