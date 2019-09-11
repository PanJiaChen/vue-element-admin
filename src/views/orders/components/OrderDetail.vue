<template>
  <div class="createProduct-container">
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
                <el-col :span="4">
                  <el-form-item label-width="120px" label="Id" class="postInfo-container-item">
                    <el-input v-model="postForm.orderId" placeholder="Id" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Seller" class="postInfo-container-item">
                    <el-input v-model="postForm.offers[0].seller.name" placeholder="Seller" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Buyer" class="postInfo-container-item">
                    <el-input v-model="postForm.buyer.name" placeholder="Buyer" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Status" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.status">
                      <el-radio-button label="Complete">Complete</el-radio-button>
                      <el-radio-button label="Cancelled">Cancelled</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="18">
                  <el-form-item label-width="120px" label="Items" class="postInfo-container-item">

                    <el-table :data="postForm.offers" border style="width: 100%">
                      <el-table-column align="center" label="Id" width="100">
                        <template slot-scope="scope">
                          <span>{{ postForm.orderId }}-{{ scope.$index + 1 }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Product" width="170">
                        <template slot-scope="scope">
                          <span>{{ scope.row.fuel.name }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Terminal" width="170">
                        <template slot-scope="scope">
                          <span>{{ scope.row.terminal.name }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Lifting" width="120">
                        <template slot-scope="scope">
                          <span>{{ scope.row | collectionTime }}</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Credit" width="120">
                        <template>
                          <span>Wie Vereinbart</span>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Price" width="90">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.price" placeholder="0.00" />
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Volume" width="80">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.quantityOrdered" placeholder="0" />
                        </template>
                      </el-table-column>

                      <el-table-column align="center" label="Line Total">
                        <template slot-scope="scope">
                          <span>{{ Number((scope.row.quantityOrdered * scope.row.price) * 10).toFixed(2) }}</span>
                        </template>
                      </el-table-column>

                    </el-table>

                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="4">
                  <el-form-item label-width="120px" label="Ex. VAT" class="postInfo-container-item">
                    <el-input v-model="exVatPrice" placeholder="0" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="4">
                  <el-form-item label-width="120px" label="VAT" class="postInfo-container-item">
                    <el-input v-model="vatPrice" placeholder="0" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="isEdit">
                <el-col :span="4">
                  <el-form-item label-width="120px" label="Total" class="postInfo-container-item">
                    <el-input v-model="totalPrice" placeholder="0" readonly />
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
import { fetchOrder } from '@/api/order'

const defaultForm = {
  id: '',
  orderId: ''
}

export default {
  name: 'OrderDetail',
  components: { Sticky },
  filters: {
    collectionTime(offer) {
      if (offer.collectionRange) {
        return 'Range'
      } else {
        return 'Add on days'
      }
    },
    credit(offer) {
      if (offer.collectionRange) {
        return 'Range'
      } else {
        return 'Add on days'
      }
    }
  },
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
    },
    exVatPrice: {
      get() {
        let price = 0
        this.postForm.offers.forEach(element => {
          price += ((element.price * 10) * element.quantityOrdered)
        })
        return price.toFixed(2)
      }
    },
    vatPrice: {
      get() {
        return (Number(this.exVatPrice) * 0.19).toFixed(2)
      }
    },
    totalPrice: {
      get() {
        return (Number(this.exVatPrice) + Number(this.vatPrice)).toFixed(2)
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

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchOrder(id).then(response => {
        const order = response.data.order

        this.postForm = order

        // // set tagsview title
        this.setTagsViewTitle()

        // // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Order'
      const route = Object.assign({}, this.tempRoute, { title: `${title} - ${this.postForm.orderId}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Order'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          // Save the account
          const methodToCall = this.isEdit ? function() {} : function() {}
          methodToCall(this.postForm).then((r) => {
            this.$notify({
              title: 'Success',
              message: 'FAQ Saved',
              type: 'success',
              duration: 2000
            })

            // Redirect to the edit page when we create a new one
            if (!this.isEdit) { this.$router.push(`/faqs/edit/${r.data.createdFaq._id}`) }

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
