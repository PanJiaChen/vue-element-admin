<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col
        class="heading"
        :xs="10"
        :sm="10"
        :lg="6"
      ><div class="">
        <span class="heading__title">My booking</span>
      </div>
      </el-col>
      <el-col
        class="heading heading-icon"
        :xs="2"
        :sm="1"
        :md="1"
      ><div class=""><i class="el-icon-date" /></div></el-col>
    </el-row>
    <el-row :gutter="20" class="card-content">
      <div class="arrow arrow-left"><i class="el-icon-arrow-left" /></div>
      <el-col class="heading-content__right">
        <p>
          <span>INJURY</span><br>
          <span class="major">Left Shoulder</span>
        </p>
        <el-row :gutter="10">
          <el-col :span="2.5" :offset="0">
            <pan-thumb :image="avatar" class="avatar" />
          </el-col>
          <el-col :span="12" :offset="0">
            <p>
              <span class="content">PT NAME</span><br>
              <span class="content-value">DIMITRI ALEXIOU</span>
            </p>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="heading-content" :xs="12" :sm="11" :md="7">
        <div class="grid-content--box">
          <div class="content">
            <p class="border-bottom border-right">
              <span class="content-title">DATE</span>
              <br>
              <span class="content-value">{{ date }}</span>
            </p>
            <p class="border-bottom border-right">
              <span class="content-title">TIME</span>
              <br>
              <span class="content-value">{{ time }}</span>
            </p>
            <p class="border-right">
              <span class="content-title">ORDER ID</span>
              <br>
              <span class="content-value">{{ orderId }}</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-button
        type="primary"
        icon="el-icon-help"
        class="action"
        :rounded="false"
      >My Exercises</el-button>
      <div class="arrow arrow-right"><i class="el-icon-arrow-right" /></div>
    </el-row>
  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
export default {
  components: {
    PanThumb
  },
  props: {
    avatar: {
      type: String,
      default: require('@/assets/img/imgpsh_fullsize_anim.jpeg')
    }
  },
  data() {
    return {
      date: '27-10-2021',
      time: '18:30 - 18:50',
      orderId: '346785'
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
  background: #f48d00 0% 0% no-repeat padding-box;
  box-shadow: 30px 30px 50px #9d248a6e;
  border-radius: 6px;
  opacity: 1;
  color: #ffec03;
  padding: 10px;
  &-icon {
    padding: 10px;
    width: 38px;
    margin-left: 4px;
  }
  &-content {
    height: 251px;
    width: 521px;
    border-radius: 6px;
    background: transparent
      linear-gradient(180deg, #f48d00 0%, #8a198e 85%, #8a198e 100%) 0% 0%
      no-repeat padding-box;
    box-shadow: 30px 30px 50px #9d248a6e;
    opacity: 1;
    &__right {
      position: absolute;
      font: normal normal 900 14px/16px SF Pro Display;
      letter-spacing: 0px;
      color: #ffffff;
      margin-top: 47px;
      margin-left: 30%;
    }
  }
  &__title {
    top: 130px;
    left: 232px;
    width: 98px;
    text-align: center;
    font: normal normal 900 15px/18px SF Pro Display Bold;
    letter-spacing: 0px;
    text-transform: uppercase;
    opacity: 1;
  }
}

.major {
  font: normal normal 900 34px/40px SF Pro Display Bold;
}

.content {
  font: normal normal normal 14px/21px SF Pro Display;
  letter-spacing: 0px;
  color: #ffffff;
  &-value {
    font: normal normal 900 14px/21px SF Pro Display Bold;
  }
}

.border {
  &-bottom {
    width: 126px;
    padding-top: 5px;
    margin-bottom: -15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ffd603;
  }
  &-right {
    width: 126px;
    padding-top: 5px;
    border-right: 1px solid #ffd603;
  }
}

.avatar {
  width: 38px !important;
  height: 38px !important;
  margin-top: 15px;
}

.action {
  position: absolute;
  bottom: 0;
  left: 0;
  min-width: 521px;
  border-radius: none;
  border-color: #6e1c80;
  background: #6e1c80;
  font: normal normal 14px/16px SF Pro Display Bold;
}

.arrow {
  position: absolute;
  color: var(--unnamed-color-6e1c80);
  font: normal normal normal 18px/22px FontAwesome;
  letter-spacing: 0px;
  color: #6e1c80;
  opacity: 1;
  top: 100px;
  &-left {
    left: -3%;
  }
  &-right {
    position: relative;
    right: 0;
  }
}

.card-content {
  height: 251px;
}

.el-row {
  margin-bottom: 5px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
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
