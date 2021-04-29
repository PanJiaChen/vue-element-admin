# 更换主题

本项目基于 element-ui 默认视觉风格搭建了。如果对视觉风格有额外的要求可以按照[官方自定义主题指导](http://element-cn.eleme.io/#/zh-CN/component/custom-theme)。该方案是通过样式变量覆盖的方式。

## 样式覆盖

element-ui 的通用样式变量可能无法满足所有定制需求，你可以通过覆盖默认的组件样式的方式实现。
由于 element-ui 的样式我们是在全局引入的，所以你想在某个`view`里面覆盖它的样式就不能加 scoped，但你又想只覆盖这个页面的 element 样式，你就可在它的父级加一个 class，以用命名空间来解决问题。或者使用[深度作用选择器](https://vue-loader.vuejs.org/zh/guide/scoped-css.html#%E6%B7%B1%E5%BA%A6%E4%BD%9C%E7%94%A8%E9%80%89%E6%8B%A9%E5%99%A8)。

```css
/* 你的命名空间 */
.article-page {
  /* element-ui 元素 */
  .el-tag {
    margin-right: 0px;
  }
}
```

一些全局的 element-ui 样式修改可以在 [@/styles/element-ui.scss](https://github.com/adempiere/adempiere-vue/blob/master/src/styles/element-ui.scss) 中进行设置。

<br/>

## 动态换肤

本项目提供了两种动态换肤的功能，各有利弊，请结合个人需求自行选择。

### element-ui 官方文档页面 换肤方式

element-ui 升级为 2.0 之后官方文档的右上角提供了动态换肤的功能，本项目也提供了该功能。
代码地址：[@/components/ThemePicker](https://github.com/adempiere/adempiere-vue/blob/master/src/components/ThemePicker/index.vue)。

**简单说明一下它的原理：**
element-ui 2.0 版本之后所有的样式都是基于 SCSS 编写的，所有的颜色都是基于几个基础颜色[变量](https://github.com/adempiere/custom-element-theme/blob/master/element-variables.scss)来设置的，所以就不难实现动态换肤了，只要找到那几个颜色变量修改它就可以了。
首先我们需要拿到通过 `package.json` 拿到 element-ui 的版本号，根据该版本号去请求相应的样式。拿到样式之后将样色，通过正则匹配和替换，将颜色变量替换成你需要的，之后动态添加 `style` 标签来覆盖原有的 css 样式。

::: tip
这里需要获取 element-ui 的版本号，从而锁定版本，以免将来 Element 升级时受到非兼容性更新的影响。
:::

```js
const version = require('element-ui/package.json').version

const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
this.getCSSString(url, chalkHandler, 'chalk')

getCSSString(url, callback, variable) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
      callback()
    }
  }
  xhr.open('GET', url)
  xhr.send()
}
```

**使用方式**

在项目中引入 ThemePicker 组件即可

```js
import ThemePicker from '@/components/ThemePicker'
```

- 优点
  - 无需准备多套主题，可以自由动态换肤
- 缺点
  - 自定义不够，只支持基础颜色的切换

<br/>
<br/>

### 多套主题换肤

本方法就是最常见的换肤方式，本地存放多套主题，两者有不同的命名空间，如写两套主题，一套叫 `day-theme` ，一套叫 `night-theme` ，`night-theme` 主题都在一个 `.night-theme` 的命名空间下，我们动态的在 body 上 add `.night-theme` ; remove `.night-theme`。

#### 使用

> 我们这里基于官方的主题生成库 [element-theme](https://github.com/ElementUI/element-theme) 进行了相应的改造。

首先我们下载 [custom-element-theme](https://github.com/adempiere/custom-element-theme) 项目

```bash
git@github.com:PanJiaChen/custom-element-theme.git
```

之后全局安装主题生成工具

```bash
npm i element-theme -g
```

进入项目目录 安装相关依赖

```bash
npm install
```

首先执行 `et -i` 生成 `element-variables.scss` 存放样式变量的文件，然后进入 `element-variables.scss` 文件 修改你自己需要的变量，修改完成之后执行 `et` ， 编译主题，最后执行`gulp` 生成命名空间。所有生成文件在 `dist` 目录下，你只需复制文件下所有内容到 `adempiere-vue` 项目中 `src/assets/custom-theme` 进行覆盖替换就行

::: tip
如果需要修改打包生成样式命名空间的名字 只要修改该[变量](https://github.com/adempiere/custom-element-theme/blob/master/gulpfile.js#L6)即可
:::

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/0726b472-90f4-4fe9-a665-26fb8f9795c3.gif)

[更多动态换肤文章](https://segmentfault.com/a/1190000009762198#articleHeader2)
