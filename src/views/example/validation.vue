<template>
  <div>
    <div class="info">
      element-ui自带的表单验证，有诸多不足。比如：一个表单项，要么为空，要么为整数，如何写？为了解决这个问题，引入hakim这个小工具，
      可以用<span class="code">与</span>与<span class="code">或</span>的方式来组合多条规则，灵活方便
      https://github.com/zzzgit/hakim
    </div>
    <div style="width: 400px">
      <el-form :model="formModel" :rules="rules" ref="form" label-width="250px">
        <el-form-item label="大于0的数字，最多1位小数" prop="item1">
          <el-input v-model="formModel.item1"></el-input>
        </el-form-item>
        <el-form-item label="同时包含英文和数字" prop="item2">
          <el-input v-model="formModel.item2"></el-input>
        </el-form-item>
        <el-form-item label="为空，为正整数，或者为电子邮件" prop="item3">
          <el-input v-model="formModel.item3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">校验</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>


<script>
import Hakim from 'hakim'
export default {
  name: 'articleDetail',
  data() {
    return {
      formModel: {
        item1: null,
        item2: null,
        item3: null
      },
      rules: {
        item1: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, resolve) => {
              if (!new Hakim([{ is: 'number' }, { gt: 0 }, { dplacesLt: 2 }]).validate(value)) {
                return resolve(new Error('大于0的数字，最多1位小数'))
              }
              return resolve()
            }
          }
        ],
        item2: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, resolve) => {
              if (!new Hakim([{ isNot: 'empty' }, { exist: 'latin' }, { exist: 'digit' }]).validate(value)) {
                return resolve(new Error('同时包含英文和数字'))
              }
              return resolve()
            }
          }
        ],
        item3: [
          {
            trigger: 'change',
            validator: (rule, value, resolve) => {
              if (!new Hakim([{ is: 'empty' }, [{ is: 'number' }, { is: 'positive' }, { is: 'integer' }], { is: 'email' }, true]).validate(value)) {
                return resolve(new Error('为空，为正整数，或者为电子邮件'))
              }
              return resolve()
            }
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .info{
    height: 80px;
    padding-top: 20px;
    padding-left: 10px;
    background-color: gray;
    margin-bottom: 20px;
  }
  .code{
    background-color: yellow;
  }

</style>
