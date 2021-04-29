# Theme

This project is based on the element-ui default visual style. If you have additional requirements for visual style, you can follow the official custom theme [guide](http://element.eleme.io/#/en-US/component/custom-theme). The method is implemented by covering style variables.

## Style override

The generic style variables for element-ui may not satisfy all custom requirements, and you can do this by overriding the default component style.Since the element-ui style is introduced globally, you can't add scoped if you want to override its style in a `view`, but if you want to override only the element style of the page, you can use it. Add a class to the parent to use the namespace to solve the problem.

Or use [Deep Selectors](https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors)。

```css
/* Your namespace */
.article-page {
  /* element-ui tag */
  .el-tag {
    margin-right: 0px;
  }
}
```

Some global element-ui style modifications can be set in [@/styles/element-ui.scss](https://github.com/adempiere/adempiere-vue/blob/master/src/styles/element-ui.scss).

<br/>

## Dynamic theme

This project provides two kinds of dynamic skinning functions, each has its own advantages and disadvantages. Please choose according to your own needs.

### Element-ui official method

After the element-ui is upgraded to 2.0, the dynamic peel function is provided in the upper right corner of the official document. This project also provides a change function.

Code: [@/components/ThemePicker](https://github.com/adempiere/adempiere-vue/blob/master/src/components/ThemePicker/index.vue)。

**Briefly explain its principle:** All styles after element-ui version 2.0 are based on SCSS, all colors are set based on a few basic color [variables](https://github.com/adempiere/custom-element-theme/blob/master/element-variables.scss), so it is not difficult to achieve dynamic skinning, as long as find a few color variables to modify it. First, we need to get the version number of element-ui through `package.json` and request the corresponding style according to the version number. After you get the style, you will change the color, replace it with the color variable you want, and then dynamically add the `style` tag to override the original CSS style.

::: tip
It is necessary to obtain the version of element-ui to lock the version so as to avoid the impact of non-compatible updates when the Element is upgraded in the future.
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

**How to use**

Import the ThemePicker component to your project

```js
import ThemePicker from '@/components/ThemePicker'
```

- Advantage
  - No need to prepare multiple sets of themes, free dynamic theme
- Shortcomings
  - Not enough customization, only support switching of basic colors

<br/>
<br/>

### Multiple sets of theme

This method is the most common way of theme, storing multiple sets of themes locally, both with different namespaces, such as writing two sets of themes, a set called `day-theme`, a set called `night-theme`, and `night-theme.` Themes are all under a `.night-theme` namespace, and we dynamically add `.night-theme` on body; remove `.night-theme`.

#### How to use

> We have made corresponding changes here based on the official theme generation library [element-theme](https://github.com/ElementUI/element-theme).

First download [custom-element-theme](https://github.com/adempiere/custom-element-theme)

```bash
git@github.com:PanJiaChen/custom-element-theme.git
```

Globally installed theme generation tool

```bash
npm i element-theme -g
```

Enter the project directory Install dependencies

```bash
npm install
```

First execute `et -i` to generate `element-variables.scss` file that stores style variables, then enter `element-variables.scss` file to modify your own variables, execute `et` after modification, compile subject, and finally Execute `gulp` to generate a namespace. All generated files are in the `dist` directory. You just copy all the contents of the file to `src/assets/custom-theme` in the `adempiere-vue` project.

::: tip
If you need to modify the name of the package generation style namespace, just modify the [variable](https://github.com/adempiere/custom-element-theme/blob/master/gulpfile.js#L6).
:::

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/0726b472-90f4-4fe9-a665-26fb8f9795c3.gif)
