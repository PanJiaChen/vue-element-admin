<template>
  <p class="warn-content">
    创建和编辑页面是不能被keep-alive 缓存的，因为keep-alive 的include 目前不支持根据路由来缓存，所以目前都是基于component name 来缓存的，如果你想要实现缓存的效果，可以使用localstorage 等浏览器缓存方案。或者不要使用keep-alive
    的include，直接缓存所有页面。详情见
    <a
      href="https://panjiachen.github.io/vue-element-admin-site/guide/essentials/tags-view.html"
      target="_blank">文档</a>
  </p>
</template>

