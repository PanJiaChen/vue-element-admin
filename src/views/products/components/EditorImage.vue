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
      </div>
      <div v-else-if="viewState==='Error'">
        <h1>ERROR please try again, if the error persist contact Chadmin!</h1>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
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
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      if (this.input) {
        this.viewState = 'Success'
      } else if (!this.input) {
        this.viewState = 'Error'
      }
      // const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      // if (!this.checkAllSuccess()) {
      //   this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
      //   return
      // }
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inputBox {
  margin-bottom: 20px;
}
</style>
