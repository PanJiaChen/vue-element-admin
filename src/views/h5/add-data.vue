<template>
  <div class="page-edit">
    <!-- 左侧操作区，控制编辑级别 -->
    <el-row>
      <el-col :span="1">
        <div class="edit-side-left">
          <el-tabs v-model="activeTab" tab-position="left" style="height: 800px">
            <template v-for="(item, index) in sidebarMenus">
              <el-tab-pane v-if="!item.pageMode || (item.page === pageMode)" :key="index" :name="item.value">
                <el-tooltip slot="label" class="item" effect="dark" :content="item.label" placement="right">
                  <i :class="item.elementUiIcon" />
                </el-tooltip>
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="edit-level">
          <componentLibs v-if="activeTab === 'componentLibs'" />
        </div>
      </el-col>

      <el-col :span="9">
        <!-- 内容编辑区 -->
        <div class="edit-content" />
      </el-col>

      <el-col :span="7">
        <!-- 属性编辑区 -->
        <div class="edit-attr" />
      </el-col>

      <!-- 操作条 -->
      <!-- <div class="edit-toolTip"></div> -->

    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import componentLibs from './components/component-libs.vue'

export default {
  components: {
    componentLibs
  },
  data() {
    return {
      activeTab: 'componentLibs', // 默认展示组件级别
      sidebarMenus: [
        {
          label: '组件列表',
          value: 'componentLibs',
          elementUiIcon: 'el-icon-s-operation'
        },
        {
          label: '页面管理',
          pageMode: 'h5',
          value: 'pageManage',
          elementUiIcon: 'el-icon-document'
        },
        {
          label: '模板库',
          value: 'templateLibs',
          elementUiIcon: 'el-icon-files'
        }
      ]
    }
  },
  computed: {
    // 混入到state属性
    ...mapGetters([
      'pageMode'
    ])
  }
}
</script>

<style lang="scss">
  .page-edit {
    height: 800px;
  }
</style>
