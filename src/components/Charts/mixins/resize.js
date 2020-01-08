import { debounce } from '@/utils'

export default {
  data() {
    return {
      $_sidebarElm: null
    }
  },
  mounted() {
    this.initListener()
  },
  activated() {
    this.resize()
    this.initListener()
  },
  beforeDestroy() {
    this.destroyListener()
  },
  deactivated() {
    this.destroyListener()
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    initListener() {
      this.__resizeHandler = debounce(() => {
        this.resize()
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)

      this.$_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      this.$_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    destroyListener() {
      window.removeEventListener('resize', this.__resizeHandler)

      this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
    },
    resize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
