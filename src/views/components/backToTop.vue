<template>
  <div class="components-container">
    <code>页面滚动到指定位置会在右下角出现返回顶部按钮</code>
    <code>可自定义按钮的样式、show/hide临界点、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素 </code>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <div>我是占位</div>
    <!--可自定义按钮的样式、show/hide临界点、返回的位置  -->
    <!--如需文字提示，可在外部添加element的<el-tooltip></el-tooltip>元素  -->
    <el-tooltip placement="top" content="文字提示">
      <back-to-top transitionName="fade" :customStyle="myBackToTopStyle" :visibilityHeight="300" :backPosition="50"></back-to-top>
    </el-tooltip>
  </div>
</template>

<script>
  import BackToTop from 'components/BackToTop';
  export default {
    components: { BackToTop },
    data() {
      return {
        myBackToTopStyle: {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px', // 请保持与高度一致以垂直居中
          background: '#e7eaf1'// 按钮的背景颜色
        }
      }
    }
  }
  </script>
