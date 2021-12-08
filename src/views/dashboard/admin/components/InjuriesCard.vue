<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col
        class="heading"
        :xs="10"
        :sm="10"
        :lg="6"
      ><div class="">
        <span class="heading__title">Injuries</span>
      </div>
      </el-col>
      <el-col
        class="heading heading-icon"
        :xs="2"
        :sm="1"
        :md="1"
      ><div class=""><i class="el-icon-help" /></div></el-col>
    </el-row>
    <el-row :gutter="20" class="card-content">
      <div class="injuries">
        <el-row :gutter="20" class="injuries-bloc">
          <el-col
            :span="15"
            :offset="0"
            class="injury-bloc injury-text injury-name"
          >Left Shoulder</el-col>
          <el-col
            :span="7"
            :offset="0"
            class="injury-bloc injury-book"
          >Book a physio</el-col>
        </el-row>
        <el-row :gutter="20" class="injuries-bloc">
          <el-col
            :span="15"
            :offset="0"
            class="injury-bloc injury-text injury-name"
          >Right Elbow</el-col>
          <el-col
            :span="7"
            :offset="0"
            class="injury-bloc injury-book"
          >Book a physio</el-col>
        </el-row>
        <el-row :gutter="20" class="injuries-bloc">
          <el-col
            :span="15"
            :offset="0"
            class="injury-bloc injury-text injury-name"
          >Right Elbow</el-col>
          <el-col
            :span="7"
            :offset="0"
            class="injury-bloc injury-book"
          >Book a physio</el-col>
        </el-row>
      </div>
      <el-button
        type="primary"
        class="action"
        :rounded="false"
      >Add new injury</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  },
  data() {
    return {
      form: {
        firstName: 'John',
        lastName: 'Scott',
        birthDate: '28/3/70',
        email: 'John@gmail.com',
        country: 'England',
        city: 'London',
        language: 'English, Greek',
        mobile: '4567 7867897'
      }
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
  box-shadow: 30px 30px 50px #9d248a6e;
  border-radius: 6px;
  opacity: 1;
  color: #778298;
  padding: 10px;
  &-icon {
    padding: 10px;
    width: 38px;
    margin-left: 4px;
  }
  &-content {
    width: 521px;
    border-radius: 6px;
    background: transparent
      linear-gradient(180deg, #e03282 0%, #8a198e 85%, #8a198e 100%) 0% 0%
      no-repeat padding-box;
    box-shadow: 30px 30px 50px #9d248a6e;
    opacity: 1;
  }
  &__title {
    top: 130px;
    left: 232px;
    width: 98px;
    height: 18px;
    text-align: center;
    font: normal normal 900 15px/18px SF Pro Display Bold;
    letter-spacing: 0px;
    text-transform: uppercase;
    opacity: 1;
  }
}

.major {
  font: normal normal 900 34px/40px SF Pro Display;
}

.content {
  font: normal normal normal 14px/21px SF Pro Display;
  letter-spacing: 0px;
  color: #ffffff;
  &-value {
    font: normal normal 900 14px/21px SF Pro Display;
  }
}

.border {
  &-bottom {
    width: 126px;
    border-bottom: 1px solid #ffd603;
  }
  &-right {
    width: 126px;
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
  min-width: 481px;
  margin: 0px 20px;
  border-radius: none;
  border-color: #dee0e6;
  background: #7ad9fd;
  color: #1c233d;
  font: normal normal 14px/16px SF Pro Display Bold;
}

.card-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 6px;
  min-height: 414px;
  overflow: scroll;
  box-shadow: 30px 30px 50px #77829840;
}

.injuries {
  margin-bottom: 50px;
}

.injuries-bloc {
  margin-left: 0px !important;
  margin-right: -13px !important;
}

.injury-bloc {
  height: 60px;
  background: #f2f3f5;
}

.injury-text {
  padding: 20px;
  font: normal normal 16px/21px SF Pro Display Bold;
  letter-spacing: 0px;
  color: #192440;
}

.injury-book {
  padding: 20px;
  text-align: center;
  font: normal normal normal 13px/15px SF Pro Display;
  letter-spacing: 0px;
  color: #192440;
  width: 149px;
}

.injury-name {
  margin-right: 5px;
  width: 328px;
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
  background-color: #f9fafc;
}

@media (min-width: 550px) {
  .card-content {
    max-width: 521px;
  }
}

@media (max-width: 550px) {
  .card {
    min-width: 376px;
  }
}
</style>
