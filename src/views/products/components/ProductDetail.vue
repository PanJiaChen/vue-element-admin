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
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Id" class="postInfo-container-item">
                    <el-input v-model="postForm._id" placeholder="Id" readonly />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Name" class="postInfo-container-item">
                    <el-input v-model="postForm.name" placeholder="Product Name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Description" class="postInfo-container-item">
                    <el-input v-model="postForm.description" placeholder="Product Description" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Density" class="postInfo-container-item">
                    <el-input v-model="postForm.lpt" placeholder="Product Density" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Duty" class="postInfo-container-item">
                    <el-input v-model="postForm.duty" placeholder="Product Duty" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="EBV" class="postInfo-container-item">
                    <el-input v-model="postForm.meta.ebv" placeholder="Product EBV" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Seasonality" class="postInfo-container-item">
                    <el-input v-model="postForm.meta.seasonality" type="textarea" rows="4" placeholder="Product Seasonality" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Price" class="postInfo-container-item">
                    <el-input v-model="postForm.meta.price" placeholder="Product Price Description" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Category" class="postInfo-container-item">
                    <el-input v-model="postForm.meta.category" placeholder="Product Category" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="120px" label="Status" class="postInfo-container-item">
                    <el-radio-group v-model="postForm.status">
                      <el-radio-button label="ENABLED">Enabled</el-radio-button>
                      <el-radio-button label="DISABLED">Disabled</el-radio-button>
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
import { fetchProduct, updateProduct, createProduct } from '@/api/product'

const defaultForm = {
  id: '',
  name: '',
  description: '',
  lpt: '',
  duty: '',
  type: '',
  meta: {
    ebv: '',
    category: '',
    seasonality: '',
    price: ''
  }
}

export default {
  name: 'ProductDetail',
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
      this.postForm.meta = Object.assign({}, defaultForm.meta)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchProduct(id).then(response => {
        const product = response.data

        if (!product.meta) {
          product.meta = {
            ebv: '',
            category: '',
            seasonality: '',
            price: ''
          }
        }

        this.postForm = product

        // // set tagsview title
        this.setTagsViewTitle()

        // // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Product'
      const route = Object.assign({}, this.tempRoute, { title: `${title} - ${this.postForm.name}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Product'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true

          // Save the account
          const methodToCall = this.isEdit ? updateProduct : createProduct
          methodToCall(this.postForm).then((r) => {
            this.$notify({
              title: 'Success',
              message: 'Product Saved',
              type: 'success',
              duration: 2000
            })

            // Redirect to the edit page when we create a new one
            if (!this.isEdit) { this.$router.push(`/products/edit/${r.data.createdFuel._id}`) }

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
