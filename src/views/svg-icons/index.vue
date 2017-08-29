<template>
  <div class="icons-container">
    <div class="icons-wrapper">
      <div v-for='item of iconsMap' :key='item' class='icon-item'>
        <icon-svg :icon-class="item" />
        <span>{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsView'

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
  }
  span {
    display: block;
    font-size: 24px;
    margin-top: 10px;
  }
}
</style>
