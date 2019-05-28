import { debounce } from '@/utils'
import { on, off } from 'element-ui/src/utils/dom'

export default {
  data() {
    return {
      $_sidebarElm: null
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    on(window, 'resize', this.__resizeHandler)

    this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    on(this.$_sidebarElm && this.$_sidebarElm, 'transitionend', this.$_sidebarResizeHandler)
  },
  beforeDestroy() {
    off(window, 'resize', this.__resizeHandler)

    off(this.$_sidebarElm && this.$_sidebarElm, 'transitionend', this.$_sidebarResizeHandler)
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  }
}
