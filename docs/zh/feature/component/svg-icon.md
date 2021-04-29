# Svg Icon 图标

全局 Svg Icon 图标组件。

默认在 [@/icons](https://github.com/adempiere/adempiere-vue/blob/master/src/icons/index.js#L6) 中注册到全局中，可以在项目中任意地方使用。所以图标均可在 [@/icons/svg](https://github.com/adempiere/adempiere-vue/tree/master/src/icons/svg)。可自行添加或者删除图标，所以图标都会被自动导入，无需手动操作。

## 使用方式

```html
<!-- icon-class 为 icon 的名字; class-name 为 icon 自定义 class-->
<svg-icon icon-class="password"  class-name='custom-class' />
```

## 改变颜色

`svg-icon` 默认会读取其父级的 color `fill: currentColor;`

你可以改变父级的`color`或者直接改变`fill`的颜色即可。

:::tip
如果你遇到图标颜色不对，可以参照本[issue](https://github.com/adempiere/adempiere-vue/issues/330)进行修改
:::

## 使用外链 <Badge text="v4.1.1+"/>

支持使用外链的形式引入 `svg`。例如：

`<svg-icon icon-class="https://xxxx.svg />`

## 大小

如果你是从 [iconfont](https://www.iconfont.cn/)下载的图标，记得使用如 Sketch 等工具规范一下图标的大小问题，不然可能会造成项目中的图标大小尺寸不统一的问题。

本项目中使用的图标都是 128\*128 大小规格的。

## 详细文章

更多详细内容 可阅读该文: [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
