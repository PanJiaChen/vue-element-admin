<template>
  <div>
    <el-row :gutter="24">
      <!-- ADempiere Vue -->
      <el-col :span="defaultSize" :style="style">
        <repository-documentation
          repository="adempiere-vue"
        />
      </el-col>

      <!-- ADempiere Proxy -->
      <el-col :span="defaultSize" :style="style">
        <repository-documentation
          repository="proxy-adempiere-api"
        />
      </el-col>

      <!-- ADempiere gRPC -->
      <el-col :span="defaultSize" :style="style">
        <repository-documentation
          repository="adempiere-gRPC-Server"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

import RepositoryDocumentation from './RepositoryDocumentation'

export default defineComponent({
  name: 'Documentation',

  components: {
    RepositoryDocumentation
  },

  setup(props, { root }) {
    const isMobile = computed(() => {
      return root.$store.state.app.device === 'mobile'
    })

    const defaultSize = computed(() => {
      if (isMobile.value) {
        return 24
      }
      return 8
    })

    const style = computed(() => {
      return 'margin-top: 2%; padding: 0.5%;'
    })

    return {
      defaultSize,
      style
    }
  }
})
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
  .el-col {
    margin-top: 2%;
    padding: 1%;
  }
  .a {
    background-color: transparent;
    float: right;
    padding: 3px 0px;
  }
}
</style>
