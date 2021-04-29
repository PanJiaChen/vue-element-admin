---
sidebarDepth: 3
---

# Svg Icon

Global icon component: Svg Icon.

By default, the Svg Icon component is registered in [@/icons](https://github.com/adempiere/adempiere-vue/blob/master/src/icons/index.js#L6), and can be used anywhere in the project. All icons can be found in [@/icons/svg](https://github.com/adempiere/adempiere-vue/tree/master/src/icons/svg). You can add or remove the icon by yourself, and the icon will be imported automatically without manual operation.

## Usage

```html
<!-- use icon-class to setting name; use `class-name` to customizing class -->
<svg-icon icon-class="password"  class-name='custom-class' />
```

## Change color

By default, `svg-icon` reads its parent color `fill: currentColor;`

You can change the parent `color` or directly `fill` color.

## Import from url <Badge text="v4.2.0+"/>

Support import `svg` from external url. E.g:

`<svg-icon icon-class="https://xxxx.svg" />`

## Size

If you are downloading an icon from [iconfont](https://www.iconfont.cn/), remember to use a tool such as Sketch to specify the size of the icon. Otherwise, the size of the icons in the project may not be uniform.

The icons used in this project are all 128\*128 size specifications.

:::tip
If you encounter the wrong color of the icon, you can refer to the [issue](https://github.com/adempiere/adempiere-vue/issues/330) for modification
:::
