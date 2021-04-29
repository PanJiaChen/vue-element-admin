# 图标

如果你没有在本项目 [Icon](https://github.com/adempiere/adempiere-vue/tree/master/src/icons/svg) 中找到需要的图标，可以到 [iconfont.cn](http://iconfont.cn/) 上选择并生成自己的业务图标库，再进行使用。或者其它 svg 图标网站，下载 svg 并放到文件夹之中就可以了。

## 生成图标库代码

首先，搜索并找到你需要的图标，将它采集到你的购物车里，在购物车里，你可以将选中的图标添加到项目中（没有的话，新建一个），后续生成的资源/代码都是以项目为维度的。

> 如果你已经有了设计稿，只是需要生成相关代码，可以上传你的图标后，再进行上面的操作。

<img width="600" alt="账户相关布局" src="https://gw.alipayobjects.com/zos/rmsportal/jJQYzRyqVFBBamUOppXH.png" />

<br />

**现在本项目支持和推荐单独导出 svg 的引入使用方式。下载方式如下图：**

<img width="600" src="https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/1f8b1e56-cfd9-4ef7-a0aa-dfb0c2883aa3.gif" />

<br />

下载完成之后将下载好的 .svg 文件放入 `@/icons/svg` 文件夹下之后就会自动导入。

## 使用方式

```js
<svg-icon icon-class="password" /> // icon-class 为 icon 的名字
```

[组件介绍](/zh/feature/component/svg-icon.md)

## 改变颜色

`svg-icon` 默认会读取其父级的 color `fill: currentColor;`

你可以改变父级的`color`或者直接改变`fill`的颜色即可。

:::tip
如果你遇到图标颜色不对，可以参照本[issue](https://github.com/adempiere/adempiere-vue/issues/330)进行修改
:::

## 详细文章

更多详细内容 可阅读该文: [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)

## 目前可用图标

[src/icons/svg](https://github.com/adempiere/adempiere-vue/tree/master/src/icons/svg)

线上[预览地址](https://adempiere.github.io/adempiere-vue/#/icon/index)
