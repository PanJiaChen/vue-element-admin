import { debounce } from '@/utils'

export default {
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)

    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (this.sidebarElm) {
      this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)

    if (this.sidebarElm) {
      this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
    }
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  }
}
