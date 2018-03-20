<template>
  <div class="components-container">
    <code>{{$t('components.backToTopTips1')}}</code>
    <code>{{$t('components.backToTopTips2')}}</code>
    <div class="placeholder-container">
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
      <div>placeholder</div>
    </div>
    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="tooltip">
      <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="50"></back-to-top>
    </el-tooltip>
  </div>
</template>

<script>
import BackToTop from '@/components/BackToTop'

export default {
  name: 'backToTop-demo',
  components: { BackToTop },
  data() {
    return {
      myBackToTopStyle: {
        right: '50px',
        bottom: '50px',
        width: '40px',
        height: '40px',
        'border-radius': '4px',
        'line-height': '45px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1'// 按钮的背景颜色 The background color of the button
      }
    }
  }
}
</script>

<style scoped>
.placeholder-container div {
  margin: 10px;
}
</style>
