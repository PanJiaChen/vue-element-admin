<template>
  <div>
    <el-badge :value="122" class="item">

      <el-popover
        placement="bottom"
        title="待办提醒"
        width="380"
        trigger="click"
      >
        <el-row>
          <el-col :span="8">
            <el-link @click="jumpReform">
              <i class="el-icon-help" />
              待整改
              <span>({{ 11 }})</span>
            </el-link>
          </el-col>
          <el-col :span="8">
            <el-link @click="jumpReview">
              <i class="el-icon-s-help" />
              待验收
              <span>({{ 22 }})</span>
            </el-link>
          </el-col>
          <el-col :span="8">
            <el-link>
              <i class="el-icon-s-operation" />
              其他
              <span>({{ 8 }})</span>
            </el-link>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-link>
              <i class="el-icon-s-release" />
              待整改
              <span>({{ 11 }})</span>
            </el-link>
          </el-col>
          <el-col :span="8">
            <el-link>
              <i class="el-icon-s-data" />
              待验收
              <span>({{ 22 }})</span>
            </el-link>
          </el-col>
          <el-col :span="8">
            <el-link>
              <i class="el-icon-s-grid" />
              其他
              <span>({{ 18 }})</span>
            </el-link>
          </el-col>
        </el-row>
        <div slot="reference" class="el-icon-s-order" />
      </el-popover>
    </el-badge>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module
// make search results more in line with expectations

export default {
  name: 'HeaderMessage',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  mounted() {
  },
  methods: {
    jumpReform() {
      this.$router.push({ path: '/hidden_danger/hidden_reform', query: { isBacklog: true }})
    },
    jumpReview() {
      this.$router.push({ path: '/hidden_danger/hidden_review', query: { isBacklog: true }})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-s-order{
  font-size: 22px !important;
  margin-top: 13px !important;
}
::v-deep .el-popover__title {
  font-size: 12px;
}
i{
  color:#1890ff;
}
::v-deep .el-badge__content.is-fixed{
  margin-top: 10px !important;
}
</style>
