<template>
  <div class="card">
    <el-row :gutter="20">
      <el-col
        class="heading"
        :xs="10"
        :sm="10"
        :lg="6"
      ><div class="">
        <span class="heading__title">Profile</span>
      </div>
      </el-col>
      <el-col
        class="heading heading-icon"
        :xs="2"
        :sm="1"
        :md="1"
      ><div class=""><i class="el-icon-document" /></div></el-col>
    </el-row>
    <el-row :gutter="20" class="card-content">
      <el-tabs type="border-card">
        <el-tab-pane label="General Profile">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <img
                src="../../../../assets/img/profile.png"
                class="profile-picture"
              >
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
              >
                <el-button
                  class="upload-btn"
                  size="small"
                >Upload photo</el-button>
              </el-upload>
            </el-col>
            <el-col :span="18" :offset="0">
              <el-form
                ref="form"
                :model="form"
                label-width="96px"
                label-position="left"
                class="form"
              >
                <el-form-item label="First name">
                  <el-input v-model="form.firstName" />
                </el-form-item>
                <el-form-item label="Last name">
                  <el-input v-model="form.lastName" />
                </el-form-item>
                <el-form-item label="Date of birth">
                  <el-input v-model="form.birthDate" />
                </el-form-item>
                <el-form-item label="email">
                  <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="Country">
                  <el-input v-model="form.country" />
                </el-form-item>
                <el-form-item label="City">
                  <el-input v-model="form.city" />
                </el-form-item>
                <el-form-item label="Language">
                  <el-input v-model="form.language" />
                </el-form-item>
                <el-form-item label="Mobile">
                  <el-input v-model="form.mobile" />
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Medical related info">
          <el-form
            ref="form"
            :model="form"
            label-width="96px"
            label-position="left"
            class="form"
          >
            <el-form-item label="First name">
              <el-input v-model="form.firstName" />
            </el-form-item>
            <el-form-item label="Last name">
              <el-input v-model="form.lastName" />
            </el-form-item>
            <el-form-item label="Date of birth">
              <el-input v-model="form.birthDate" />
            </el-form-item>
            <el-form-item label="email">
              <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="Country">
              <el-input v-model="form.country" />
            </el-form-item>
            <el-form-item label="City">
              <el-input v-model="form.city" />
            </el-form-item>
            <el-form-item label="Language">
              <el-input v-model="form.language" />
            </el-form-item>
            <el-form-item label="Mobile">
              <el-input v-model="form.mobile" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <el-button
        type="primary"
        class="action"
        :rounded="false"
      >Save Profile</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
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
      },
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `The limit is 3, you selected ${
          files.length
        } files this time, add up to ${files.length + fileList.length} totally`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfert of ${file.name} ?`)
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

.profile-picture {
  width: 101px;
  height: 101px;
  border-radius: 5px 5px 0px 0px;
}

.action {
  position: absolute;
  bottom: 0;
  left: 0;
  min-width: 481px;
  margin: 20px;
  border-radius: none;
  border-color: #dee0e6;
  background: #dee0e6;
  color: #778298;
  font: normal normal 14px/16px SF Pro Display Bold;
}

.form {
  padding-bottom: 30px;
}

.upload-btn {
  padding: 10px;
  background: #778298;
  color: #FFFFFF;
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

.card {
  &-content {
    border-radius: 6px;
  }
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
