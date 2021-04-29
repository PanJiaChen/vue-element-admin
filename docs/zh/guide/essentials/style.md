# 样式

## CSS Modules

在样式开发过程中，有两个问题比较突出：

- 全局污染 —— CSS 文件中的选择器是全局生效的，不同文件中的同名选择器，根据 build 后生成文件中的先后顺序，后面的样式会将前面的覆盖；

- 选择器复杂 —— 为了避免上面的问题，我们在编写样式的时候不得不小心翼翼，类名里会带上限制范围的标示，变得越来越长，多人开发时还很容易导致命名风格混乱，一个元素上使用的选择器个数也可能越来越多，最终导致难以维护。

好在 vue 为我们提供了 [scoped](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles) 可以很方便的解决上述问题。
它顾名思义给 css 加了一个域的概念。

```css
/* 编译前 */
.example {
  color: red;
}

/* 编译后 */
.example[_v-f3f3eg9] {
  color: red;
}
```

只要加上 `<style scoped>` 这样 css 就只会作用在当前组件内了。详细文档见 [vue-loader](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles)

::: tip
使用 scoped 后，父组件的样式将不会渗透到子组件中。不过一个子组件的根节点会同时受其父组件的 scoped CSS 和子组件的 scoped CSS 的影响。这样设计是为了让父组件可以从布局的角度出发，调整其子组件根元素的样式。
:::

<br/>

## 目录结构

adempiere-vue 所有全局样式都在 `@/styles` 下设置

```bash
├── styles
│   ├── btn.scss                 # 按钮样式
│   ├── element-ui.scss          # 全局自定义 element-ui 样式
│   ├── index.scss               # 全局通用样式
│   ├── mixin.scss               # 全局mixin
│   ├── sidebar.scss             # sidebar css
│   ├── transition.scss          # vue transition 动画
│   └── variables.scss           # 全局变量
```

常见的工作流程是，全局样式都写在 `src/styles` 目录下，每个页面自己对应的样式都写在自己的 `.vue` 文件之中

```css
<style>
/* global styles */
</style>

<style scoped>
/* local styles */
</style>
```

<br>

## 自定义 element-ui 样式

现在我们来说说怎么覆盖 element-ui 样式。由于 element-ui 的样式我们是在全局引入的，所以你想在某个页面里面覆盖它的样式就不能加 scoped，但你又想只覆盖这个页面的 element 样式，你就可在它的父级加一个 class，用命名空间来解决问题。

```css
.article-page {
  /* 你的命名空间 */
  .el-tag {
    /* element-ui 元素*/
    margin-right: 0px;
  }
}
```

**当然也可以使用深度作用选择器 下文会介绍**

## 父组件改变子组件样式 深度选择器

当你子组件使用了 `scoped` 但在父组件又想修改子组件的样式可以 通过 `>>>` 来实现：

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

将会编译成

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

如果你使用了一些预处理的东西，如 `sass` 你可以通过 `/deep/` 来代替 `>>>` 实现想要的效果。

所以你想覆盖某个特定页面 `element` 的 button 的样式，你可以这样做：

```css
.xxx-container >>> .el-button{
  xxxx
}
```

[官方文档](https://vue-loader.vuejs.org/en/features/scoped-css.html)

<br>

## Autoprefixer [新版本已无该问题]

vue-cli 有一个小坑，它默认 autoprefixer 只会对通过 vue-loader 引入的样式才会有有作用，换而言之也就是 .vue 文件里面的 css autoprefixer 才会效果。相关问题 [issues/544](https://github.com/vuejs-templates/webpack/issues/544) , [issues/600](https://github.com/vuejs-templates/webpack/issues/600) 。解决方案也很简单粗暴

```html
//app.vue
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
</style>
```

你在 .vue 文件中引入你要的样式就可以了，或者你可以改变 vue-cli 的文件在 css-loader 前面在加一个 postcss-loader，在前面的 issue 地址中已经给出了解决方案。不过新版本已经默认解决处理了这个问题。

<br>

## Postcss

这里再来说一下 postcss 的配置问题，新版的 [vue-cli webpack 模板](https://github.com/vuejs-templates/webpack) init 之后根目录下默认有一个`postcss.config.js` 。vue-loader 的 postcss 会默认读取这个文件的里的配置项，所以在这里直接改配置文件就可以了。配置和 [postcss](https://github.com/postcss/postcss)是一样的。

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {}
  }
}

// package.json
"browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
```

如上面代码所述的，autoprefixer 会去读取 package.json 下 browserslist 的配置参数

- `> 1%` 兼容全球使用率大于 1%的浏览器
- `last 2 versions` 兼容每个浏览器的最近两个版本
- `not ie <= 8` 不兼容 ie8 及以下

具体可见 [browserslist](https://github.com/ai/browserslist)

`postcss`也还有很多很多其它的功能大家可以[自行去探究](https://www.postcss.parts/)

<br>

## Mixin

本项目没有设置自动注入 sass 的 mixin 到全局，所以需要在使用的地方手动引入 mixin

```scss
<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
</style>
```

如需要自动将 mixin 注入到全局 ，可以使用[sass-resources-loader](https://github.com/shakacode/sass-resources-loader)
