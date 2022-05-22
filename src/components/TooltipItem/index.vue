<template>
  <div class="box">
    <div ref="row_content" class="item_box">
      <p :style="`flex-basis: ${labelWidth}px`">{{ label }}</p>
      <el-tooltip :disabled="tooltipShow" effect="dark" :content="content" placement="top">
        <p ref="content_item">{{ content }}</p>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TooltipItem',
  props: {
    labelWidth: {
      type: Number,
      default: 80
    },
    label: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tooltipShow: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.tooltipShowFun()
      })
    })
  },
  methods: {
    tooltipShowFun() {
      const rowWidth = this.$refs['row_content'].offsetWidth
      const contentWidth = this.$refs['content_item'].offsetWidth
      if ((rowWidth - this.labelWidth) <= contentWidth) {
        this.tooltipShow = false
      } else {
        this.tooltipShow = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box{
  width: 100%;
  .item_box{
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    p{
      &:nth-child(1) {
        display: block;
        flex-basis: 80px;
        flex-grow: 0;
        flex-shrink: 0;
        font-weight: 500;
        font-size: 16px;
        color: #384250
      }
      &:nth-child(2) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: 500;
        font-size: 14px;
        color: #8f8f8f
      }
    }
  }
}
</style>
