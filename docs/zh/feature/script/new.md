# New <Badge text="v4.0.0+"/>

平时日常工作中，做最多的就是写业务模块和组件。当每次新开一个`view`或者`component`的时候都需要手动创建一个新`.vue`，然后创建一个`<template>`、`<script>`、`<style>`，还是有些麻烦的。

所以在新版本中，基于[plop](https://github.com/amwmedia/plop)，提供了几个基础模板，方便创建新的`view`或者`component`。

执行如下命令：

```bash
npm run new
```

![plop](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/5f8ea239-aaa5-4e91-9d09-ed56b33a110d.gif)

如上面 gif 所示，现在只要轻松的点几次回车就可以轻松生成我要的基础代码片段。这里只是一个 demo，你可以按照自己需求定制模板。

有额外模板需求的可以按照`plop`的文档，到`plop-templates`目录下，创建自定义的模板。

其实这个功能和 `snippets`做的事情差不多。如果你觉得配置太复杂，可以安装如[Vue 2 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets)这种基于 VSCode 代码片段。
