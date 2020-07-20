<template>
  <div class="component-libs-wrapper">
    <p class="page-title">组件库</p>
    <el-scrollbar>
      <ul class="scrollbar-wrapper">
        <li v-for="(item, index) in componentsList" :key="index">
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
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import eleConfig from '../ele-config'
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
    handleItemClick() {

    }
  }
}
</script>

<style lang="scss">
  .component-libs-wrapper {
    .page-title {
      text-align: center;
    }
    .scrollbar-wrapper {
      height: 600px;
      .item-wrapper {
        display: flex;
        justify-content: space-between;
        .component-item {
          background-color: gray;
          width: 120px;
          height: 120px;
          border: 1px solid white;
          &:hover {
            border-color: aqua;
          }
        }
      }
    }
  }

</style>
