<template>
  <div class="createAccount-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          Save
        </el-button>
      </sticky>

      <div class="createPost-main-container">

        <el-row>
          <el-col :span="20">
            <div class="postInfo-container">
              <el-row v-if="isEdit">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Id" class="postInfo-container-item">
                    <el-input v-model="postForm._id" placeholder="Id" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="$store.state.settings.platform === 'OLFDE'">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Region:" class="postInfo-container-item">
                    <el-select v-model="postForm.region_id" :remote-method="getRemoteRegionList" filterable default-first-option remote placeholder="Search Regions" loading-text="Loading...">
                      <el-option v-for="(item,index) in regionListOptions" :key="item+index" :label="item.name" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Name" class="postInfo-container-item">
                    <el-input v-model="postForm.name" placeholder="Terminal Display Name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="$store.state.settings.platform === 'OLFDE'">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Full Name" class="postInfo-container-item">
                    <el-input v-model="postForm.fullName" placeholder="Terminal Full Name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Identifier" class="postInfo-container-item">
                    <el-input v-model="postForm.identifier" placeholder="Terminal Full Name" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row v-if="$store.state.settings.platform === 'OLFDE'">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Contact Num" class="postInfo-container-item">
                    <el-input v-model="postForm.contactNumber" placeholder="Terminal Contact Number" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Address Line 1" class="postInfo-container-item">
                    <el-input v-model="postForm.address.line1" placeholder="Address Line 1" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Address Line 2" class="postInfo-container-item">
                    <el-input v-model="postForm.address.line2" placeholder="Address Line 2" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="County" class="postInfo-container-item">
                    <el-input v-model="postForm.address.county" placeholder="County" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Post Code" class="postInfo-container-item">
                    <el-input v-model="postForm.address.postCode" placeholder="Post Code" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="$store.state.settings.platform === 'OLFDE'">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Country" class="postInfo-container-item">
                    <el-input v-model="postForm.address.country" placeholder="Country" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="$store.state.settings.platform === 'OLFDE'">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Opening Hours" class="postInfo-container-item">
                    <el-input v-model="postForm.meta.openingHours" type="textarea" rows="2" placeholder="Terminal Opening Hours" />
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Status" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.status">
                      <el-radio-button label="100">Enabled</el-radio-button>
                      <el-radio-button label="200">Disabled</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row> -->

            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchTerminal, updateTerminal, createTerminal } from '@/api/terminal'
const fetchRegionList = require('@/api/region').fetchList

const defaultForm = {
  id: '',
  name: '',
  fullName: '',
  contactNumber: '',
  region_id: '',
  // status: '',
  address: {
    line1: '',
    line2: '',
    county: '',
    postCode: '',
    country: ''
  },
  meta: {
    openingHours: ''
  }
}

export default {
  name: 'AccountDetail',
  components: { Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + 'Epic Success brudda',
          type: 'error'
        })
        callback(new Error(rule.field + ' ERRRR'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      regionListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }]
        // content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.address = Object.assign({}, defaultForm.address)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchTerminal(id).then(response => {
        const terminal = response.data

        if (!terminal.meta) {
          terminal.meta = {
            openingHours: ''
          }
        }

        this.postForm = terminal

        // // set tagsview title
        this.setTagsViewTitle()

        // // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Terminal'
      const route = Object.assign({}, this.tempRoute, { title: `${title} - ${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Terminal'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          // Save the account
          const methodToCall = this.isEdit ? updateTerminal : createTerminal
          methodToCall(this.postForm).then((r) => {
            this.$notify({
              title: 'Success',
              message: 'Terminal Saved',
              type: 'success',
              duration: 2000
            })

            // Redirect to the edit page when we create a new one
            if (!this.isEdit) { this.$router.push(`/terminals/edit/${r.data.id}`) }

            this.loading = false
          }).catch((e) => {
            console.dir(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getRemoteRegionList() {
      fetchRegionList().then(response => {
        if (!response.data.regions) return
        this.regionListOptions = response.data.regions.map(v => { return { name: v.name, id: v._id } })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
