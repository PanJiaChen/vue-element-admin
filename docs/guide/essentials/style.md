# Style

## CSS Modules

In the code of stylIn the style development process, there are two issues are more prominent:

- Global pollution —— The selector in the CSS file is global. The same name selector in different files, according to the order in the build generation file, the styles generated later will overwrite the previous ones.

- Selector complex —— In order to avoid the above problems, we have to be careful when writing styles, the name of the class will be marked with a range of restrictions, multi-person development is also very easy to lead to the chaos of the naming style. The classnames getting longer and longer. Eventually, it's hard to maintain.

Fortunately vue provides us with [scoped](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles) can easily solve the above problem. As the name suggests, it adds a scoped concept to css.

```css
/* Compile before */
.example {
  color: red;
}

/* Compile after */
.example[_v-f3f3eg9] {
  color: red;
}
```

If you add `<style scoped>` the css will only effect in the current component。For detailed documentation, see [vue-loader](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles)

::: tip
With scoped, the parent component's styles will not leak into child components. However, a child component's root node will be affected by both the parent's scoped CSS and the child's scoped CSS. This is by design so that the parent can style the child root element for layout purposes.
:::

<br/>

## Project Structure

adempiere-vue All global styles are set in the `@/styles` directory.

```bash
├── styles
│   ├── btn.scss                 # button css
│   ├── element-ui.scss          # global custom element-ui style
│   ├── index.scss               # global common style
│   ├── mixin.scss               # global sass mixin
│   ├── sidebar.scss             # sidebar css
│   ├── transition.scss          # vue transition animation
│   └── variables.scss           # global variables
```

The common workflow is that the global styles are written in the `src/styles` directory and each page's own style is written in its own `.vue` file.

```css
<style>
/* global styles */
</style>

<style scoped>
/* local styles */
</style>
```

## Custom element-ui style

Now let's talk about how to override the element-ui style. Because element-ui style we are import in the global, so you can't add `scoped` to a page if you want to overwrite it, but you want to override only the element style of this page, you can add a class in its parent, using the namespace to solve this problem.

```css
.article-page {
  /* you namespace*/
  .el-tag {
    /* element-ui element tag*/
    margin-right: 0px;
  }
}
```

**Of course, you can also use the deep selectors as described below.**

## Deep Selectors

**Parent component changes child component style.**

If you want a selector in scoped styles to be "deep", i.e. affecting child components, you can use the >>> combinator:

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

Will be compiled into

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

Some pre-processors, such as SASS, may not be able to parse >>> properly. In those cases you can use the /deep/ combinator instead - it's an alias for >>> and works exactly the same.

```css
.xxx-container >>> .el-button{
  xxxx
}
```

[Official document](https://vue-loader.vuejs.org/en/features/scoped-css.html)

## Postcss

Let's talk about the configuration of postcss. After the new version of the [vue-cli webpack template](https://github.com/vuejs-templates/webpack) initialization, there is a default `postcss.config.js` in the root directory. By default, `vue-loader` will read the configuration of postcss from it, so here directly to change the configuration file on it. The configuration is the same as [postcss](https://github.com/postcss/postcss).

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

As described in the previous code, autoprefixer reads the configuration parameters of browserslist under package.json.

- `> 1%` Compatible with browser with global usage above 1%
- `last 2 versions` Compatible with the last two versions of each browser
- `not ie <= 8` Not compatible ie8 and below

More detail [browserslist](https://github.com/ai/browserslist)

`postcss` has many other features [to explore by yourself](https://www.postcss.parts/)

## Mixin

This project does not set to automatically inject sass mixin to the global, so you need to manually introduce the mixin.

```scss
<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
</style>
```

If you need to automatically inject mixin global, you can use
[sass-resources-loader](https://github.com/shakacode/sass-resources-loader).
