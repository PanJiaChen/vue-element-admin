<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">All rights reserved
          <a style="color: #20a0ff;" href="https://wallstreetcn.com" target="_blank">wallstreetcn</a>
        </div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">Please check that the URL you entered is correct, or click the button below to return to the homepage.</div>
        <a href="" class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return 'The webmaster said that you can not enter this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container {
  left: 50%;
  position: absolute;
  top: 40%;
  transform: translate(-50%, -50%);
}

.wscn-http404 {
  overflow: hidden;
  padding: 0 50px;
  position: relative;
  width: 1200px;

  .pic-404 {
    float: left;
    overflow: hidden;
    position: relative;
    width: 600px;

    &__parent {
      width: 100%;
    }

    &__child {
      position: absolute;

      &.left {
        animation-delay: 1s;
        animation-duration: 2s;
        animation-fill-mode: forwards;
        animation-name: cloudLeft;
        animation-timing-function: linear;
        left: 220px;
        opacity: 0;
        top: 17px;
        width: 80px;
      }

      &.mid {
        animation-delay: 1.2s;
        animation-duration: 2s;
        animation-fill-mode: forwards;
        animation-name: cloudMid;
        animation-timing-function: linear;
        left: 420px;
        opacity: 0;
        top: 10px;
        width: 46px;
      }

      &.right {
        animation-delay: 1s;
        animation-duration: 2s;
        animation-fill-mode: forwards;
        animation-name: cloudRight;
        animation-timing-function: linear;
        left: 500px;
        opacity: 0;
        top: 100px;
        width: 62px;
      }
      @keyframes cloudLeft {
        0% {
          left: 220px;
          opacity: 0;
          top: 17px;
        }

        20% {
          left: 188px;
          opacity: 1;
          top: 33px;
        }

        80% {
          left: 92px;
          opacity: 1;
          top: 81px;
        }

        100% {
          left: 60px;
          opacity: 0;
          top: 97px;
        }
      }
      @keyframes cloudMid {
        0% {
          left: 420px;
          opacity: 0;
          top: 10px;
        }

        20% {
          left: 360px;
          opacity: 1;
          top: 40px;
        }

        70% {
          left: 180px;
          opacity: 1;
          top: 130px;
        }

        100% {
          left: 120px;
          opacity: 0;
          top: 160px;
        }
      }
      @keyframes cloudRight {
        0% {
          left: 500px;
          opacity: 0;
          top: 100px;
        }

        20% {
          left: 460px;
          opacity: 1;
          top: 120px;
        }

        80% {
          left: 340px;
          opacity: 1;
          top: 180px;
        }

        100% {
          left: 300px;
          opacity: 0;
          top: 200px;
        }
      }
    }
  }

  .bullshit {
    float: left;
    overflow: hidden;
    padding: 30px 0;
    position: relative;
    width: 300px;

    &__oops {
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-name: slideUp;
      color: #1482f0;
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      margin-bottom: 20px;
      opacity: 0;
    }

    &__headline {
      animation-delay: 0.1s;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-name: slideUp;
      color: #222;
      font-size: 20px;
      font-weight: bold;
      line-height: 24px;
      margin-bottom: 10px;
      opacity: 0;
    }

    &__info {
      animation-delay: 0.2s;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-name: slideUp;
      color: grey;
      font-size: 13px;
      line-height: 21px;
      margin-bottom: 30px;
      opacity: 0;
    }

    &__return-home {
      animation-delay: 0.3s;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-name: slideUp;
      background: #1482f0;
      border-radius: 100px;
      color: #fff;
      cursor: pointer;
      display: block;
      float: left;
      font-size: 14px;
      height: 36px;
      line-height: 36px;
      opacity: 0;
      text-align: center;
      width: 110px;
    }
    @keyframes slideUp {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }

      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}
</style>
