<template>
  <div class="components-container">
    <el-row>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn blue-btn" to="/components/index">Components</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn light-blue-btn" to="/charts/index">Charts</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn pink-btn" to="/excel/download">Excel</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn green-btn" to="/example/table/complex-table">Table</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn tiffany-btn" to="/form/edit-form">Form</router-link>
      </el-col>
      <el-col :span="4" class='text-center'>
        <router-link class="pan-btn yellow-btn" to="/theme/index">Theme</router-link>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Material Design 的input</span>
          </div>
          <div style="height:100px;">
            <el-form :model="demo" :rules="demoRules">
              <el-form-item prop="title">
                <md-input icon="search" name="title" placeholder="输入标题" v-model="demo.title">标题</md-input>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图片hover效果</span>
          </div>
          <div class="component-item">
            <pan-thumb width='100px' height='100px' image='https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'>
              vue-element-admin
            </pan-thumb>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>水波纹 waves v-directive</span>
          </div>
          <div class="component-item">
            <el-button v-waves type="primary">水波纹效果</el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>hover text</span>
          </div>
          <div class="component-item">
            <mallki className='mallki-text' text='vue-element-admin'></mallki>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import waves from '@/directive/waves/index.js' // 水波纹指令
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: {
    PanThumb,
    MdInput,
    Mallki
  },
  directives: {
    waves
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入六个字符'))
      } else {
        callback()
      }
    }
    return {
      demo: {
        title: ''
      },
      demoRules: {
        title: [{ required: true, trigger: 'change', validator: validate }]
      }
    }
  }
}
</script>

<style scoped>
.component-item{
  min-height: 100px;
}
</style>
