<template>
  <div class="edit-area-wrapper">
    <div class="edit-area-inner">
      <!-- 用来控制展示区缩放 -->
      <div class="edit-main" :style="{width: projectData.width + 'px', height: projectData.height + 'px', transform: 'scale('+scale+')'}">
        <div class="page-preview-wrapper">
          <!-- 提供一个容器组件,包裹选中的组件 -->
          <edit-shape
            v-for="item in activePage.elements"
            :key="item.uuid"
          >
            <!-- 用动态组件来渲染 -->
            <component :is="item.elName" class="ele-edit-pane" />
          </edit-shape>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      scale: 1
    }
  },
  computed: {
    ...mapState({
      projectData: state => state.editor.projectData,
      activePageUUID: state => state.editor.activePageUUID,
      activeElementUUID: state => state.editor.activeElementUUID
    }),
    ...mapGetters([
      'activePage'
    ])
  }
}
</script>
