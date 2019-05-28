import { debounce } from '@/utils'
import { on, off } from 'element-ui/src/utils/dom'

export default {
  data() {
    return {
      $_sidebarElm: null
    }
  },
  mounted() {
    this.$_initResizeEvent()
    this.$_initSidebarResizeEvent()
  },
  beforeDestroy() {
    this.$_destroyResizeEvent()
    this.$_destroySidebarResizeEvent()
  },
  // to fixed bug when cached by keep-alive
  // https://github.com/PanJiaChen/vue-element-admin/issues/2116
  activated() {
    this.$_initResizeEvent()
    this.$_initSidebarResizeEvent()
  },
  deactivated() {
    this.$_destroyResizeEvent()
    this.$_destroySidebarResizeEvent()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_resizeHandler() {
      return debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)()
    },
    $_initResizeEvent() {
      on(window, 'resize', this.$_resizeHandler)
    },
    $_destroyResizeEvent() {
      off(window, 'resize', this.$_resizeHandler)
    },
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.$_resizeHandler()
      }
    },
    $_initSidebarResizeEvent() {
      this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      on(this.$_sidebarElm && this.$_sidebarElm, 'transitionend', this.$_sidebarResizeHandler)
    },
    $_destroySidebarResizeEvent() {
      off(this.$_sidebarElm && this.$_sidebarElm, 'transitionend', this.$_sidebarResizeHandler)
    }
  }
}
