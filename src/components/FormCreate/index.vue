<template>
  <div>
    <div v-if="index==0">
      <el-card class="box-card" style="width: 90%;margin-left: 5%;min-height: 150px;margin-top: 10px;">
        <div />
        <el-input
          v-model="title"
          class="radio1"
          placeholder="Please enter the form topic"
          clearable
          style="width: 100%;font-size: 28px;"
        />
        <el-input
          v-model="description"
          class="textarea"
          type="textarea"
          :rows="2"
          placeholder="Please enter the form description"
          style="width: 100%;font-size: 16px;margin-top: 10px;"
        />
      </el-card>
      <el-card
        v-for="i in num"
        :id="i"
        :key="i"
        class="box-card"
        style="width: 90%;margin-left: 5%;min-height: 150px;margin-top: 10px;"
      >
        <div>
          <el-tag>{{ i }}</el-tag>
          <el-input
            v-model="inputBT[i-1]"
            placeholder="Please enter the title"
            clearable
            style="width: 75%;"
          />

          <el-select v-model="optiontype[i-1]" placeholder="Please choose" style="width: 18%;float:right;">
            <el-option
              v-for="item in options"
              :key="item.val"
              :label="item.label"
              :value="item.val"
            />
          </el-select>
        </div>
        <div style="width: 100%;height: 0;margin-top:5px;border: solid 0.5px lightgrey" />
        <div v-if="optiontype[i-1]=='input'" style="color: grey;margin-top: 20px;">
          Entered by someone else
        </div>

        <div v-if="optiontype[i-1]=='InputNumber'" style="color: grey;margin-top: 20px;">
          Entered by someone else
        </div>
        <div v-if="optiontype[i-1]=='radio'" class="radio" style="color: grey;margin-top: 20px;">

          <div v-for="j in radionum[i-1]" :key="j">
            ○
            <el-input
              v-model="radioname[i-1][j-1]"
              placeholder="Please enter the option name"
              clearable
              style="width: 80%;"
            />

          </div>
          <div>
            <el-button type="text" @click="addradio(i-1)"><i
              class="el-icon-circle-plus-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
            <el-button type="text" @click="deleteradio(i-1)"><i
              class="el-icon-remove-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
          </div>

        </div>

        <div v-if="optiontype[i-1]=='checkbox'" class="radio" style="color: grey;margin-top: 20px;">

          <div v-for="j in checkboxnum[i-1]" :key="j">
            □
            <el-input
              v-model="checkboxname[i-1][j-1]"
              placeholder="Please enter the option name"
              clearable
              style="width: 80%;"
            />

          </div>
          <div>
            <el-button type="text" @click="addcheckbox(i-1)"><i
              class="el-icon-circle-plus-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
            <el-button type="text" @click="deletecheckbox(i-1)"><i
              class="el-icon-remove-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
          </div>

        </div>
        <div v-if="optiontype[i-1]=='select'" class="radio" style="color: grey;margin-top: 20px;">

          <div v-for="j in selectnum[i-1]" :key="j">
            {{ j }}、
            <el-input
              v-model="selectname[i-1][j-1]"
              placeholder="Please enter the option name"
              clearable
              style="width: 80%;"
            />

          </div>
          <div>
            <el-button type="text" @click="addselect(i-1)"><i
              class="el-icon-circle-plus-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
            <el-button type="text" @click="deleteselect(i-1)"><i
              class="el-icon-remove-outline"
              style="font-size: 20px;margin-top: 10px"
            /></el-button>
          </div>

        </div>

      </el-card>
      <div style="text-align: right;width:80%;margin-left: 10%;margin-top: 10px;">
        <el-tooltip class="item" effect="light" content="Add" placement="top">
          <el-button type="text" style="font-size: 30px;" @click="adddiv"><i class="el-icon-circle-plus" /></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="light" content="Remove" placement="top">
          <el-button type="text" style="font-size: 30px;" @click="delectdiv"><i class="el-icon-remove" /></el-button>
        </el-tooltip>

      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="preview()">Preview</el-button>
      </div>
    </div>
    <div v-if="index==1">
      <el-card class="box-card" style="width: 90%;margin-left: 5%;margin-top: 5px;">
        <div style="font-size: 25px;text-align: center">
          {{ title }}
        </div>

        <div style="color: grey;">
          {{ description }}
        </div>
      </el-card>
      <el-card class="box-card" style="margin-top: 5px;width: 90%;margin-left: 5%;">
        <div ref="imageWrapper" class="imageWrapper">
          <form-create v-model="yulanform" :rule="formrule" :option="option" style="margin-top: 20px;" @on-submit="onSubmit" />
        </div>
      </el-card>

      <div style="text-align: center;padding-top: 5px;">
        <el-button type="primary" @click="changeindex(0)">Back</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import formCreate from '@form-create/element-ui'

export default {
  name: 'FromCreate',
  components: {
    formCreate: formCreate.$form()
  },
  data() {
    return {
      index: 0,
      title: '',
      description: '',
      // 卡片的个数
      num: 1,
      // 输入框
      inputBT: [],
      // 下拉选择框
      options: [{
        val: 'input',
        label: 'Input'
      }, {
        val: 'InputNumber',
        label: 'InputNumber'
      }, {
        val: 'radio',
        label: 'Radio'
      }, {
        val: 'checkbox',
        label: 'Checkbox'
      }, {
        val: 'select',
        label: 'Select'
      }, {
        val: 'rate',
        label: 'Rate'
      }],
      // 组件的类型
      optiontype: [],

      // 单选按钮的选项个数
      radionum: [2],
      // 单选按钮名字
      radioname: [[]],

      // 多选按钮的选项个数
      checkboxnum: [2],
      // 多选按钮名字
      checkboxname: [[]],

      // 下拉框的选项个数
      selectnum: [2],
      // 下拉框名字
      selectname: [[]],

      // 生成的表单规则
      formrule: [],
      // 表单实例对象
      yulanform: {},

      option: {
        submitBtn: {
          show: true,
          size: 'small',
          long: '20px',
          innerText: 'Submit'
        }

      },
      dataURL: ''
    }
  },
  methods: {
    // 增加组件
    adddiv() {
      this.num += 1
      this.inputBT.push()
      this.radionum.push(2)
      this.radioname.push([])
      this.checkboxnum.push(2)
      this.checkboxname.push([])
      this.selectnum.push(2)
      this.selectname.push([])
    },
    // 删除组件
    delectdiv() {
      this.num -= 1
      this.inputBT.pop()
      this.radionum.pop()
      this.radioname.pop()
      this.checkboxnum.pop()
      this.checkboxname.pop()
      this.selectnum.pop()
      this.selectname.pop()
    },
    // 增加单选按钮选项，实时更新数组用$set
    addradio(i) {
      this.$set(this.radionum, i, this.radionum[i] + 1)
    },
    deleteradio(i) {
      this.$set(this.radionum, i, this.radionum[i] - 1)
    },

    // 增加多选按钮选项
    addcheckbox(i) {
      this.$set(this.checkboxnum, i, this.checkboxnum[i] + 1)
    },
    deletecheckbox(i) {
      this.$set(this.checkboxnum, i, this.checkboxnum[i] - 1)
    },

    // 增加下拉框选项
    addselect(i) {
      this.$set(this.selectnum, i, this.selectnum[i] + 1)
    },
    deleteselect(i) {
      this.$set(this.selectnum, i, this.selectnum[i] - 1)
    },

    preview() {
      this.formrule = []
      for (let i = 0; i < this.inputBT.length; i++) {
        console.log('optiontype:' + this.optiontype[i])

        if (this.optiontype[i] === 'radio') {
          var h = (this.radioname[i].length)

          console.log('this.radioname:' + this.radioname[i])

          var options = []
          for (var j = 0; j < h; j++) {
            options.push(
              { value: this.radioname[i][j], label: this.radioname[i][j] },
            )
          }

          this.formrule.push({
            type: this.optiontype[i],
            field: this.inputBT[i],
            title: this.inputBT[i],
            options: options

          },)
        } else if (this.optiontype[i] === 'checkbox') {
          const h = (this.checkboxname[i].length)

          const options = []
          for (let j = 0; j < h; j++) {
            options.push(
              { value: this.checkboxname[i][j], label: this.checkboxname[i][j] },
            )
          }

          this.formrule.push({
            type: this.optiontype[i],
            field: this.inputBT[i],
            title: this.inputBT[i],
            options: options,
            value: []

          },)
        } else if (this.optiontype[i] === 'select') {
          const h = (this.selectname[i].length)// 3

          const options = []
          for (let j = 0; j < h; j++) {
            options.push(
              { value: this.selectname[i][j], label: this.selectname[i][j] },
            )
          }

          this.formrule.push({
            type: this.optiontype[i],
            field: this.inputBT[i],
            title: this.inputBT[i],
            options: options

          },)
        } else {
          this.formrule.push({
            type: this.optiontype[i],
            field: this.inputBT[i],
            title: this.inputBT[i]
          },)
          console.log(this.formrule)
        }
      }
      this.index = 1
    },
    onSubmit(formData) {
      alert(JSON.stringify(formData))
    },
    changeindex(msg) {
      this.index = msg
    }
  }
}
</script>

<style>
  .radio .el-input__inner {
    width: 220px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    /*outline: medium;*/
  }
  .radio1 .el-input__inner {
    width: 100%;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    /*outline: medium;*/
  }
  .textarea .el-textarea__inner {
    width: 100%;
    border-top-width: 0px;
    border-left-width: 0px;
    border-right-width: 0px;
    border-bottom-width: 1px;
    /*outline: medium;*/
  }
</style>
