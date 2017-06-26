<template>
  <div class="app-container">
    <div class="wrapper">
      <code>
      这半年来一直在用vue写管理后台，目前后台已经有百来个个页面，十几种权限，但维护成本依然很低，所以准备开源分享一下后台开发的经验和成果。目前的技术栈主要的采用vue+element+axios由webpack2打包.由于是个人项目，所以数据请求都是用了mockjs模拟。注意：在次项目基础上改造开发时请移除mock文件。
      写了一个系列的教程配套文章，如何从零构建后一个完整的后台项目:
        <ul>
          <li><a target='_blank' class='lin' href="https://github.com/PanJiaChen/vue-element-admin/">项目地址</a></li>
          <li><a target='_blank' class='lin' href="https://github.com/PanJiaChen/vue-element-admin/wiki">wiki</a></li>
          <li><a target='_blank' href="https://juejin.im/post/59097cd7a22b9d0065fb61d2">手摸手，带你用 vue 撸后台 系列一(基础篇)</a></li>
          <li><a target='_blank' href="https://juejin.im/post/591aa14f570c35006961acac">手摸手，带你用 vue 撸后台 系列二(登录权限篇)</a></li>
          <li><a target='_blank' href="https://juejin.im/post/593121aa0ce4630057f70d35">手摸手，带你用 vue 撸后台 系列三 (实战篇)</a></li>
          <li><a target='_blank' href="https://segmentfault.com/a/1190000009090836">手摸手，带你封装一个vue component</a></li>
        </ul>
    </code>
    </div>
  </div>
</template>

<style scoped>
  .wrapper{
    width: 800px;
    margin: 30px auto;
  }
</style>
