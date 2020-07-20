<template>
  <div class="my-work">
    <div class="tab">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handeleTabChange">
        <el-tab-pane v-for="(item, index) in pageModeList" :key="index" :name="item.value" :disabled="item.disabled">
          <div slot="label">{{ item.label }}</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="work-content">
      <div class="nav-list">
        <div class="nau-list-item" :class="{active: searchParams.type === 'my'}" @click="handleSearch('my')">我的作品{{ myCount }}</div>
        <div class="nau-list-item" :class="{active: searchParams.type === 'share'}" @click="handleSearch('share')">参与作品{{ shareCount }}</div>
      </div>

      <div class="content-wrapper">
        <!-- 新增区域 -->
        <div class="item-add" @click="handleAddConfig">
          <i class="el-icon-plus" />
          <p>{{ searchParams.pageMode | getLabelText() }}</p>
        </div>

        <!-- 已编辑页面 -->
        <div v-for="(item, index) in pageList" :key="index" class="page-item" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    getLabelText(val) {
      return `新建${val}`
    }
  },
  data() {
    return {
      // h5类型
      pageModeList: [
        {
          value: 'h5',
          label: 'H5',
          disabled: false
        },
        {
          value: 'longPage',
          label: '长页H5',
          disabled: false
        },
        {
          name: 'relativePage',
          label: '排版图文',
          disabled: true
        },
        {
          value: 'pc',
          label: 'PC页面',
          disabled: true
        }
      ],
      searchParams: {
        type: 'my',
        pageMode: 'h5'
      },
      shareCount: 5,
      myCount: 6,
      pageList: []
    }
  },
  created() {
    this.getPageList()
    this.getPageCount()
  },
  methods: {
    // 切换tab获取数据
    handeleTabChange() {
      this.getPageList()
      this.getPageCount()
    },
    getPageList() {

    },
    getPageCount() {

    },
    handleSearch(str) {
      this.searchParams.type = str || ''
    },
    handleAddConfig() {
      // 关闭左侧目录
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
      this.$router.push('add')
    }
  }
}
</script>

<style lang="scss">
  $green: #30B08F;
  .my-work {
    padding: 10px;
    .work-content {
      .nav-list {
        width: 20%;
        display: flex;
        justify-content: space-around;
        .nau-list-item {
          cursor: pointer;
          &.active {
            color: red;
          }
        }
      }

      .content-wrapper {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .item-add {
          width: 150px;
          height: 240px;
          background-color: gray;
          text-align: center;
          border: 1px solid white;
          transition: all 0.3s;
          &:hover {
            border-color: $green;
          }
          .el-icon-plus {
            margin-top: 55%;
          }
        }
      }
    }
  }
</style>
