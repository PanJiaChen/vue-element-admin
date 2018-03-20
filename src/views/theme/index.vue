<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <a class='link-type link-title' target="_blank" href='https://panjiachen.github.io/vue-element-admin-site/#/theme'>
        {{$t('theme.documentation')}}
        </a>
      </div>
      <div class="box-item">
        <span class="field-label">{{$t('theme.change')}} : </span>
        <el-switch v-model="theme"></el-switch>
        <code style="margin-top:15px;">{{$t('theme.tips')}}</code>
      </div>
    </el-card>

    <div class="block">
      <el-button type="primary">Primary</el-button>
      <el-button type="success">Success</el-button>
      <el-button type="info">Info</el-button>
      <el-button type="warning">Warning</el-button>
      <el-button type="danger">Danger</el-button>
    </div>

    <div class="block">
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
      <el-button type="primary" icon="el-icon-search">Search</el-button>
      <el-button type="primary">
        Upload
        <i class="el-icon-upload el-icon-right"></i>
      </el-button>
    </div>

    <div class="block">
      <el-tag class='tag-item' v-for="tag in tags" :type="tag.type" :key='tag.type'>
        {{tag.name}}
      </el-tag>
    </div>

    <div class="block">
      <el-radio-group v-model="radio">
        <el-radio :label="3">Option A</el-radio>
        <el-radio :label="6">Option B</el-radio>
        <el-radio :label="9">Option C</el-radio>
      </el-radio-group>
    </div>

    <div class="block">
      <el-slider v-model="slideValue"></el-slider>
    </div>

  </div>
</template>

<script>
import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css

export default {
  name: 'theme',
  data() {
    return {
      theme: false,
      tags: [
        { name: 'Tag One', type: '' },
        { name: 'Tag Two', type: 'info' },
        { name: 'Tag Three', type: 'success' },
        { name: 'Tag Four', type: 'warning' },
        { name: 'Tag Five', type: 'danger' }
      ],
      slideValue: 50,
      radio: 3
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  margin: 20px auto;
}

.block {
  padding: 30px 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
