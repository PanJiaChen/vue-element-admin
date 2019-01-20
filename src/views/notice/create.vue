<template>
  <div class="bdsharebuttonbox bdshare-button-style0-16">
    <a href="#" class="bds_more" data-cmd="more"/>
    <a href="#" class="bds_qzone" data-cmd="qzone"/>
    <a href="#" class="bds_tsina" data-cmd="tsina"/>
    <a href="#" class="bds_tqq" data-cmd="tqq"/>
    <a href="#" class="bds_renren" data-cmd="renren"/>
    <a href="#" class="bds_weixin" data-cmd="weixin"/>
  </div>
</template>
<script>
export default {
  beforeCreate() {
    const _this = this
    setTimeout(() => {
      _this.setup()
    }, 0)
  },
  methods: {
    setup() {
      window._bd_share_config = {
        common: {
          bdSnsKey: {},
          bdText: '',
          bdMini: '2',
          bdPic: '',
          bdStyle: '0',
          bdSize: '16'
        },
        share: {},
        image: {
          viewList: ['qzone', 'tsina', 'tqq', 'renren', 'weixin'],
          viewText: '分享到：',
          viewSize: '16'
        },
        selectShare: {
          bdContainerClass: null,
          bdSelectMiniList: ['qzone', 'tsina', 'tqq', 'renren', 'weixin']
        }
      }
      const s = document.createElement('script')
      s.type = 'text/javascript'
      s.src =
        'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' +
        ~(-new Date() / 36e5)
      document.body.appendChild(s)
    }
  }
}
</script>
