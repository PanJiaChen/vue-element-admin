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
                    <el-input v-model="postForm.id" placeholder="Id" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Display Name" class="postInfo-container-item">
                    <el-input v-model="postForm.name" placeholder="Display Name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Full Name" class="postInfo-container-item">
                    <el-input v-model="postForm.fullName" placeholder="Full Name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Email" class="postInfo-container-item">
                    <el-input v-model="postForm.email" placeholder="Account Email" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Phone" class="postInfo-container-item">
                    <el-input v-model="postForm.phone" placeholder="Account Phone" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Address Line 1" class="postInfo-container-item">
                    <el-input v-model="postForm.address.addressLine1" placeholder="Address Line 1" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Address Line 2" class="postInfo-container-item">
                    <el-input v-model="postForm.address.addressLine2" placeholder="Address Line 2" />
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
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Country" class="postInfo-container-item">
                    <el-input v-model="postForm.address.country" placeholder="Country" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Type" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.type">
                      <el-radio-button label="buyer">Buyer</el-radio-button>
                      <el-radio-button label="seller">Seller</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="120px" label="Fuel Restriction" class="postInfo-container-item">
                    <el-transfer
                      v-model="postForm.restrictions.fuels"
                      :titles="['Disabled', 'Enabled']"
                      :data="fuelsAvailable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="120px" label="Terminal Restriction" class="postInfo-container-item">
                    <el-transfer
                      v-model="postForm.restrictions.terminals"
                      :titles="['Disabled', 'Enabled']"
                      :data="terminalsAvailable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="120px" label="Lifting Restriction" class="postInfo-container-item">
                    <el-transfer
                      v-model="postForm.restrictions.liftingPeriods"
                      :titles="['Disabled', 'Enabled']"
                      :data="liftingPeriodsAvailable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label-width="120px" label="Payment Restriction" class="postInfo-container-item">
                    <el-transfer
                      v-model="postForm.restrictions.paymentTerms"
                      :titles="['Disabled', 'Enabled']"
                      :data="paymentTermsAvailable"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Status" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.status">
                      <el-radio-button label="100">Enabled</el-radio-button>
                      <el-radio-button label="200">Disabled</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

            </div>
          </el-col>
        </el-row>

      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchAccount, updateAccount, createAccount } from '@/api/account'
const fetchFuelList = require('@/api/product').fetchList
const fetchTerminalList = require('@/api/terminal').fetchList
const fetchLiftingPeriodsList = require('@/api/liftingPeriod').fetchList
const fetchPaymentTermsList = require('@/api/paymentTerm').fetchList

const defaultForm = {
  id: '',
  name: '',
  phone: '',
  email: '',
  orderConfirmationEmail: '',
  restrictions: {
    fuels: [],
    terminals: [],
    liftingPeriods: [],
    paymentTerms: []
  },
  address: {
    addressLine1: '',
    addressLine2: '',
    county: '',
    postCode: '',
    country: ''
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
      userListOptions: [],
      rules: {
        // image_uri: [{ validator: validateRequire }],
        name: [{ validator: validateRequire }]
        // content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      terminals: [],
      fuels: [],
      paymentTerms: [],
      liftingPeriods: [],
      fuelRestrictions: []
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
    },
    fuelsAvailable: {
      get() {
        return this.fuels.map(f => {
          return {
            label: f.name,
            key: f._id
          }
        })
      },
      set(value) {
        this.postForm.restrictions.fuels = value
      }
    },
    terminalsAvailable: {
      get() {
        return this.terminals.map(f => {
          return {
            label: f.name,
            key: f._id
          }
        })
      },
      set(value) {
        this.postForm.restrictions.terminals = value
      }
    },
    liftingPeriodsAvailable: {
      get() {
        return this.liftingPeriods.map(f => {
          return {
            label: f.name,
            key: f._id
          }
        })
      },
      set(value) {
        this.postForm.restrictions.liftingPeriods = value
      }
    },
    paymentTermsAvailable: {
      get() {
        return this.paymentTerms.map(f => {
          return {
            label: f.name,
            key: f._id
          }
        })
      },
      set(value) {
        this.postForm.restrictions.paymentTerms = value
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Fetch the fuels and terminals, to be used as part of the restriction process
    const requestPromises = [
      fetchFuelList({ platform: 'OLFDE' }),
      fetchTerminalList({ platform: 'OLFDE' }),
      fetchLiftingPeriodsList({ platform: 'OLFDE' }),
      fetchPaymentTermsList({ platform: 'OLFDE' })
    ]

    Promise.all(requestPromises).then((responses) => {
      this.fuels = responses[0].data.fuels
      this.terminals = responses[1].data.terminals
      this.liftingPeriods = responses[2].data.liftingPeriods
      this.paymentTerms = responses[3].data.paymentTerms
    })

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchAccount(id).then(response => {
        const account = response.data
        if (!account.restrictions) {
          account.restrictions = {
            fuels: [],
            terminals: [],
            paymentTerms: [],
            liftingPeriods: []
          }
        }

        if (account.restrictions.fuels.length === 0) {
          account.restrictions.fuels = this.fuels.map(f => f._id)
        }

        if (account.restrictions.terminals.length === 0) {
          account.restrictions.terminals = this.terminals.map(f => f._id)
        }

        if (account.restrictions.paymentTerms != null && account.restrictions.paymentTerms.length === 0) {
          account.restrictions.paymentTerms = this.paymentTerms.map(f => f._id)
        }

        if (account.restrictions.liftingPeriods != null && account.restrictions.liftingPeriods.length === 0) {
          account.restrictions.liftingPeriods = this.liftingPeriods.map(f => f._id)
        }

        this.postForm = account

        // // set tagsview title
        this.setTagsViewTitle()

        // // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Account'
      const route = Object.assign({}, this.tempRoute, { title: `${title} - ${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Account'
      document.title = `${title} - ${this.postForm.name}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          // Make a clone of the object
          const accountToSave = Object.assign({}, this.postForm)

          // Save the account
          const methodToCall = this.isEdit ? updateAccount : createAccount
          methodToCall(accountToSave).then((r) => {
            this.$notify({
              title: 'Success',
              message: 'Account Saved',
              type: 'success',
              duration: 2000
            })

            // Redirect to the edit page when we create a new one
            if (!this.isEdit) { this.$router.push(`/accounts/edit/${r.data.id}`) }

            this.loading = false
          }).catch((e) => {
            console.dir(e)
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
