<template>
  <p class="warn-content">
    创建和编辑页面是不能被keep-alive 缓存的，因为keep-alive 的include 目前不支持根据路由来缓存，所以目前都是基于component name 来缓存的，如果你想要实现缓存的效果，可以使用localstorage 等游览器缓存方案。或者不要使用keep-alive
    的include，直接缓存所有页面。详情见
    <a href="https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/tags-view?id=%E7%BC%93%E5%AD%98%E4%B8%8D%E9%80%82%E5%90%88%E5%9C%BA%E6%99%AF"
      target="_blank">文档</a>
  </p>
</template>

