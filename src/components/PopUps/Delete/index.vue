<template>
  <div>
    <el-button icon="el-icon-delete" size="mini" type="danger" @click="openDeletePopup">
      Delete
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <div v-if="viewState==='initialState'">
        <div>
          <h3>
            Are you sure you want to delete this {{ type }} ?
          </h3>
          <p>To delete this {{ type }}, type in <b>{{ item.name }}</b> and click delete</p>
        </div>
        <el-row :gutter="20">
          <el-col :span="12" :offset="6">
            <div class="inputBox">
              <el-input v-model="input" placeholder="Please input" />
            </div>
          </el-col>
        </el-row>
        <el-button @click="dialogVisible = false">
          Cancel
        </el-button>
        <el-button type="danger" :disabled="isNameCorrect" @click="handleSubmit">
          Confirm
        </el-button>
      </div>
      <div v-else-if="viewState==='Success'">
        <h1>SUCCESS you can now close this popup</h1>
        <h1>{{ item._id }}</h1>
        <el-button @click="dialogVisible = false">
          Close
        </el-button>
      </div>
      <div v-else-if="viewState==='Error'">
        <h1>ERROR please try again, if the error persist contact Chadmin!</h1>
        <el-button @click="dialogVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// const deleteProduct = require('@/api/product').deleteProduct
import { deleteProduct } from '@/api/product'

export default {
  name: 'DeletePopUp',
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          name: 'BROKEN!-KEROSENOS-BROKEN!',
          _id: 'THIS-ID-IS-BROKEN!'
        }
      }
    },
    type: {
      type: String,
      default: 'chad'
    }
  },
  data() {
    return {
      dialogVisible: false,
      viewState: 'initialState',
      isNameCorrect: true,
      input: ''
    }
  },
  watch: {
    input: function() {
      if (this.input === this.item.name) {
        this.isNameCorrect = false
      } else {
        this.isNameCorrect = true
      }
    }
  },
  methods: {
    openDeletePopup() {
      this.dialogVisible = true
      this.viewState = 'initialState'
      this.input = ''
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      console.log(this.item._id)
      console.log(deleteProduct(this.item._id))
      // .then((r) => {
      // console.log(r)
      // })
      if (this.input) {
        this.viewState = 'Success'
      } else if (!this.input) {
        this.viewState = 'Error'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inputBox {
  margin-bottom: 20px;
}
</style>
