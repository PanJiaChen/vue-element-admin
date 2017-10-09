<template>
  <div class="icons-container">
    <div class="icons-wrapper">
      <div v-for='item of iconsMap' :key='item' class='icon-item' @click='handleClipboard(generateIconCode(item),$event)'>
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            {{generateIconCode(item)}}
          </div>
          <icon-svg :icon-class="item" />
        </el-tooltip>
        <span>{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsView'
import clipboard from '@/utils/clipboard' // use clipboard directly

export default {
  data() {
    return {
      iconsMap: []
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap
  },
  methods: {
    generateIconCode(symbol) {
      return `<icon-svg :icon-class="${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 40px 20px 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 20px;
    height: 137px;
    text-align: center;
    width: 120px;
    float: left;
    font-size: 40px;
    color: #666;
    cursor: pointer;
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
}
</style>
