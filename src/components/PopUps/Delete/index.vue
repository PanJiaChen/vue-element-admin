<template>
  <div>
    <el-button icon="el-icon-delete" size="mini" type="danger" @click="openDeletePopup">
      Delete
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <div v-if="viewState==='input'">
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
      <div v-else-if="viewState==='confirmation'">
        <i :class="confirmation.icon" :style="confirmation.iconStyle" />
        <p>{{ confirmation.text }}</p>
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
import { deleteTerminal } from '@/api/terminal'
// import { `delete${this.type}` } from `@/api/${this.type}`

export default {
  name: 'DeletePopUp',
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          name: 'BROKEN!-BROKEN!',
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
      isNameCorrect: true,
      input: '',
      viewState: 'input',
      Error: false,
      confirmation: {
        text: 'Request has been sent, waiting for a response from the servers',
        icon: 'el-icon-loading',
        iconStyle: 'font-size: 75px;'
      }
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
      // do the object assing thing to default like edit/create product
      this.dialogVisible = true
      this.viewState = 'input'
      this.input = ''
      this.confirmation = {
        text: 'Request has been sent, waiting for a response from the servers',
        icon: 'el-icon-loading',
        iconStyle: 'font-size: 75px;'
      }
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      if (this.type === 'terminal') {
        deleteTerminal(this.item._id).then((response) => {
          this.confirmationPage(response)
        })
      } else if (this.type === 'product') {
        deleteProduct(this.item._id).then((response) => {
          this.confirmationPage(response)
        })
      }
      // delete${this.type}(this.item._id))
      // .then((r) => {
      // console.log(r)
      // confirmationPage (response)
      // })
    },
    confirmationPage(response) {
      this.viewState = 'confirmation'
      if (response && response.data.message === 'Completed') {
        this.confirmation = {
          text: `Succesfully deleted ${this.item.name} form ${this.type}s list`,
          icon: 'el-icon-circle-check',
          iconStyle: 'font-size: 75px; color: green;'
        }
      } else if (!response || response === 'error') {
        this.confirmation = {
          text: `Error deleting ${this.item.name} form ${this.type}s list. Please refresh your page and try again. If the Error persists, please contact dev team`,
          icon: 'el-icon-circle-close',
          iconStyle: 'font-size: 75px; color: red;'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inputBox {
  margin-bottom: 20px;
}
.icon {
}

</style>
