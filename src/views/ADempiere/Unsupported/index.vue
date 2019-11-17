<template>
  <div class="wscn-http404-container">
    <div class="unsupported">
      <div class="unsupported__oops">{{ $t('views.unsupportedSorry') }}</div>
      <div class="unsupported__headline">{{ $t('views.unsupportedHeadline') }}</div>
      <div class="unsupported__info">{{ $t('views.unsupportedInfo') }}</div>
      <el-button type="primary" round @click="redirect">{{ $t('views.unsupportedButton') }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnsupportedView',
  methods: {
    redirect() {
      this.$store.dispatch('tagsView/delView', this.$route)
        .then(({ visitedViews }) => {
          this.$router.push('/dashboard')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .wscn-http404-container {
    transform: translate(-50%,-50%);
    position: absolute;
    top: 40%;
    left: 50%;
  }
  .unsupported {
    position: relative;
    float: left;
    width: 100%;
    padding: 30px 30px;
    overflow: hidden;
    &__oops {
      font-size: 72px;
      font-weight: bold;
      line-height: 70px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    &__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    &__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
</style>
