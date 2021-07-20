<template>
  <el-collapse @change="handleChange">
    <el-collapse-item :title="title" name="1">
      <el-card>
        <div v-if="imgList.length > 0" class="img-item">
          <div v-for="(item , i) in imgList" :key="i" class="img-box">
            <div class="img">
              <el-image :preview-src-list="imgPathList" :src="baseUrl +'?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid='+ item.sys_attach__attach_id +'&is_highimage=1'" />
            </div>
            <div class="img-name" :title="item.sys_attach__attach_name">{{ item.sys_attach__attach_name }}</div>
          </div>
          <template v-if="imgList.length % 3 > 0">
            <div v-for="(l ,k) of (3 - imgList.length % 3)" :key="k" class="img-box" />
          </template>
        </div>
        <div v-else class="no-data">
          无{{ title }}
        </div>
      </el-card>
    </el-collapse-item>
  </el-collapse>

</template>

<script>
import api from './api'

export default {
  name: 'ShowImg',
  components: {
    // buttons
  },
  props: {
    dataId: {
      type: String,
      default: null
    },
    tableName: {
      type: String,
      default: null
    },
    funId: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      deptTree: [],
      ids: [],
      levels: [],
      pager: {
        pageNo: 0,
        pageSize: 100,
        total: 0
      },
      value: '',
      dept_id: '',
      level: '',
      id: '',
      parent_id: '',
      form: {
        dept_name: '',
        dept_code: '',
        memo: ''
      },
      dialogFormVisible: false,
      dialogEditVisible: false,
      formLabelWidth: '120px',
      auditForm: {},
      saveFrom: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'sys_dept__dept_name'
      },
      treeList: [],
      whereSql: false,
      whereValue: '',
      formData: {},
      attach_path: null,
      baseUrl: window.location.origin + '/bwhse/fileAction.do',
      href: '',
      imgList: [],
      imgPathList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
  },
  methods: {
    getList() {
      this.loading = true
      let pageNo = this.pager.pageNo * this.pager.pageSize - this.pager.pageSize
      if (pageNo < 0) {
        pageNo = 0
      }
      api.getDate(
        this.pager.pageSize,
        pageNo,
        this.dataId,
        this.funId
      ).then(data => {
        if (data.success) {
          this.data = data.data.root

          this.imgList = this.data.filter(d => {
            return d.sys_attach__content_type === 'image/png'
          })
          this.imgPathList = this.imgList.map(d => {
            return `${this.baseUrl}?funid=sys_attach&pagetype=editgrid&eventcode=down&nousercheck=1&dataType=byte&keyid=${d.sys_attach__attach_id}&is_highimage=1`
          })
          console.log(this.imgList, 'this.imgList')
          this.pager.total = data.data.total
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    handleChange(val) {
      if (val.length > 0) {
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-card {
    margin-top: 10px;
  }
  .el-table__row {
    a {
      color: blue;
      text-decoration: underline;
    }
  }
  .img-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: 20rpx;
    align-content: flex-start;
    align-items: flex-start;
  }
  .buttons{
    display: flex;
  }
  .el-button--primary {
    height: 26.8px;
    margin-right: 10px;
  }
  .pagination{
    overflow: auto;
  }
  .img-box{
    text-align: center;
    width: 33%;
  }
  .img-name {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .img{
    width: 188px;
    height: 108px;
    text-align: center;
    line-height: 58px;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 2px 2px 5px;
    margin-right: 4px;
    box-sizing: border-box;
    // padding: 5px;
    margin: 20px;
    .el-image{
      width: 100%;
      height: 100%;
    }
  }
  ::v-deep .el-collapse-item__header{
    display: block !important;
    text-align: center;
  }
  ::v-deep .el-collapse-item__wrap{
    border: none;
  }
  .no-data{
    text-align: center;
    color: #8a8f93;
  }
  .uploader__img {
    height: 200px;
    width: 200px;
  }
</style>
