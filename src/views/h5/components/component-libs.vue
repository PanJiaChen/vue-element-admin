<template>
  <div class="component-libs-wrapper">
    <p class="page-title">组件库</p>
    <el-scrollbar>
      <div class="scrollbar-wrapper">
        <div v-for="(item, index) in componentsList" :key="index">
          <!-- 二级标题 -->
          <div class="components-libs-title">
            <p>{{ item.title }}</p>
          </div>
          <div v-if="item.components && item.components.length" class="item-wrapper">
            <div
              v-for="(ele, idx) in item.components"
              :key="idx"
              class="component-item"
              @click="handleItemClick(ele)"
            >
              <div class="lib-icon">
                <i :class="[ele.icon]" />
              </div>
              <p class="lib-item-title">{{ ele.title }}</p>
            </div>
          </div>
          <div v-else>待完善。。。</div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import eleConfig from '../ele-config'
import { rigester_component } from '@/plugin/index'
export default {
  data() {
    return {
      componentsList: eleConfig
    }
  },
  created() {
    console.log('ll;', this.componentsList)
  },
  methods: {
    handleItemClick(obj) {
      // 获取组件属性
      const props = this.getComponentProps(obj.elName)
      // 触发数据更新
      this.$store.dispatch('addElement', { ...obj, needProps: props })
    },
    /*
      根据组件名判断需要添加的属性props，这个在自定义组件中已经定义了，目前取出即可
      一个组件其实就是一个obj
    */
    getComponentProps(elName) {
      const elComponentData = rigester_component[elName] || ''
      if (!elComponentData) return
    }
  }
}
</script>

<style lang="scss">
  .component-libs-wrapper {
    height: 700px;
    .page-title {
      text-align: center;
    }
    .scrollbar-wrapper {
      height: 700px;
      .item-wrapper {
        display: flex;
        justify-content: start;
        flex-flow: wrap;
        .component-item {
          background-color: gray;
          width: 80px;
          height: 80px;
          border: 1px solid white;
          text-align: center;
          margin-left: 15px;
          margin-top: 10px;
          transition: all 0.3s;
          &:hover {
            border-color: aqua;
            background-color: white;
            color: aqua;
          }
        }
      }
    }
  }

</style>
