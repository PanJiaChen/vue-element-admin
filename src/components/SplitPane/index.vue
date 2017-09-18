<template>
  <div ref :style="{ cursor, userSelect}" class="vue-splitter-container clearfix" @mouseup="onMouseUp" @mousemove="onMouseMove">
    <pane class="splitter-pane splitter-paneL" :split="split" :style="{ [type]: percent+'%'}">
      <slot name="paneL"></slot>
    </pane>
    <resizer :style="{ [resizeType]: percent+'%'}" :split="split" :onMouseDown="onMouseDown" @click="onClick"></resizer>
    <pane class="splitter-pane splitter-paneR" :split="split" :style="{ [type]: 100-percent+'%'}">
      <slot name="paneR"></slot>
    </pane>
  </div>
</template>

<script>
import Resizer from './Resizer'
import Pane from './Pane'
export default {
  name: 'splitPane',
  components: { Resizer, Pane },
  props: {
    margin: {
      type: Number,
      default: 10
    },
    split: {
      validator(value) {
        return ['vertical', 'horizontal'].indexOf(value) >= 0
      },
      required: true
    }
  },
  data() {
    return {
      active: false,
      hasMoved: false,
      height: null,
      percent: 50,
      type: this.split === 'vertical' ? 'width' : 'height',
      resizeType: this.split === 'vertical' ? 'left' : 'top'
    }
  },
  computed: {
    userSelect() {
      return this.active ? 'none' : ''
    },
    cursor() {
      return this.active ? 'col-resize' : ''
    }
  },
  methods: {
    onClick() {
      if (!this.hasMoved) {
        this.percent = 50
        this.$emit('resize')
      }
    },
    onMouseDown() {
      this.active = true
      this.hasMoved = false
    },
    onMouseUp() {
      this.active = false
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false
      }
      if (this.active) {
        let offset = 0
        let target = e.currentTarget
        if (this.split === 'vertical') {
          while (target) {
            offset += target.offsetLeft
            target = target.offsetParent
          }
        } else {
          while (target) {
            offset += target.offsetTop
            target = target.offsetParent
          }
        }

        const currentPage = this.split === 'vertical' ? e.pageX : e.pageY
        const targetOffset = this.split === 'vertical' ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight
        const percent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100
        if (percent > this.margin && percent < 100 - this.margin) {
          this.percent = percent
        }
        this.$emit('resize')
        this.hasMoved = true
      }
    }
  }
}
</script>

<style scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.vue-splitter-container {
  height: 100%;
  /*display: flex;*/
  position: relative;
}
</style>
