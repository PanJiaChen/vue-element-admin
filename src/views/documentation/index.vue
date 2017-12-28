<template>
  <div class="app-container documentation-container">
    <a class="document-btn" target='_blank' href="https://panjiachen.github.io/vue-element-admin-site/#/">{{$t('documentation.documentation')}}</a>
    <a class="document-btn" target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">{{$t('documentation.github')}}</a>
    <dropdown-menu style="float:left;margin-left:50px;" title='系列文章' :items='articleList'></dropdown-menu>
  </div>
</template>
<script>
import DropdownMenu from '@/components/Share/dropdownMenu'

export default {
  name: 'documentation',
  components: { DropdownMenu },
  data() {
    return {
      articleList: [
        { title: '基础篇', href: 'https://segmentfault.com/a/1190000009275424' },
        { title: '登录权限篇', href: 'https://segmentfault.com/a/1190000009506097' },
        { title: '实战篇', href: 'https://segmentfault.com/a/1190000009762198' },
        { title: 'vueAdmin-template 篇', href: 'https://segmentfault.com/a/1190000010043013' },
        { title: '自行封装 component', href: 'https://segmentfault.com/a/1190000009090836' },
        { title: '优雅的使用 icon', href: 'https://segmentfault.com/a/https://segmentfault.com/a/1190000012213278' }
      ]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.documentation-container {
  margin: 50px;
  .document-btn {
    float: left;
    margin-left: 50px;
    vertical-align: middle;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
}
</style>
