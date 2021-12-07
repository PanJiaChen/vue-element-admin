<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col class="heading-content" :xs="12" :sm="11" :md="7">
        <div class="grid-content--box">
          <div class="content">
            <p class="border-bottom border-right">
              <span class="content-title">Add a consultation</span>
              <br>
              <span class="content-value">Book a physio</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    image() {
      return require('@/assets/img/cover.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.heading {
  top: 120px;
  left: 211px;
  width: 479px;
  height: 38px;
  color: #ffec03;
  padding: 10px;
  mix-blend-mode: soft-light;
  &-icon {
    padding: 10px;
    width: 38px;
    margin-left: 4px;
  }
  &-content {
    width: 521px;
    height: 293px;
    border-radius: 7px;
    background-image: url('https://i.ibb.co/tMg8c4t/cover.png'), linear-gradient(180deg, #58B8EB 0%, #6E1C80 85%, #6E1C80 100%);
    background-repeat: no-repeat;
    background-position: center;
    &__right {
      position: absolute;
      font: normal normal 900 14px/16px SF Pro Display;
      letter-spacing: 0px;
      color: #ffffff;
      margin-top: 47px;
      margin-left: 30%;
      height: 251px;
    }
  }
  &__title {
    top: 130px;
    left: 232px;
    width: 98px;
    height: 18px;
    text-align: center;
    font: normal normal 900 15px/18px SF Pro Display;
    letter-spacing: 0px;
    text-transform: uppercase;
    opacity: 1;
  }
}

.major {
  font: normal normal 900 34px/40px SF Pro Display;
}

.content {
  font: normal normal normal 14px/16px SF Pro Display;
  letter-spacing: 0px;
  color: #ffffff;
  margin-top: 20%;
  margin-left: 20px;
  &-value {
    font: normal normal 900 34px/40px SF Pro Display Bold;
  }
}

.el-row {
  margin-bottom: 5px;
}

.grid-content {
  min-height: 36px;
  &--box {
    min-height: 251px;
  }
}
.row-bg {
  padding: 10px 0;
}

@media (min-width: 550px) {
  .card {
    min-width: 521px;
  }
}
@media (max-width: 550px) {
  .card {
    min-width: 376px;
  }
}
</style>
