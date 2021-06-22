import { Loading } from 'element-ui'

let loadingInstance
export const loading = {
  loadingCount: 0,
  open() {
    this.loadingCount === 0 && (loadingInstance = Loading.service({
      lock: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    }))
    this.loadingCount++
  },
  close() {
    setTimeout(() => {
      this.loadingCount--
      this.loadingCount === 0 && loadingInstance && loadingInstance.close()
    }, 20)
  }
}
