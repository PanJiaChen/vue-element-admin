<template>
  <div class="app-container documentation-container">
    <el-button type="primary" @click.prevent.stop="guide">Show Guide</el-button>
  </div>
</template>
<script>

import * as Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'

export default {
  name: 'guide',
  components: { },
  mounted() {
    this.driver = new Driver()
  },
  data() {
    return {
      driver: null
    }
  },
  methods: {
    guide() {
      this.driver.defineSteps([
        {
          element: '.screenfull',
          popover: {
            title: 'Screenfull',
            description: 'Body of the popover',
            position: 'left'
          }
        },
        {
          element: '.international-icon',
          popover: {
            title: 'Lang Switch',
            description: 'Body of the popover',
            position: 'left'
          }
        },

        {
          element: '.theme-switch',
          popover: {
            title: 'Theme Switch',
            description: 'Body of the popover',
            position: 'left'
          }
        }
      ])
      this.driver.start()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    vertical-align: middle;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
