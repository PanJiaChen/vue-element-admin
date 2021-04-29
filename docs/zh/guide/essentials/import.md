# 引入外部模块

除了 element-ui 组件以及脚手架内置的业务组件，有时我们还需要引入其他外部组件，这里以引入 [vue-count-to](https://github.com/adempiere/vue-countTo) 为例进行介绍。

## 引入依赖

在终端输入下面的命令完成安装：

```bash
$ npm install vue-count-to --save
```

> 加上 `--save` 参数会自动添加依赖到 package.json 中去。

<br/>

## 使用

### 全局注册

**main.js**

```js
import countTo from 'vue-count-to'
Vue.component('countTo', countTo)
```

```html
<template>
  <countTo :startVal='startVal' :endVal='endVal' :duration='3000'></countTo>
</template>
```

### 局部注册

```html
<template>
  <countTo :startVal='startVal' :endVal='endVal' :duration='3000'></countTo>
</template>

<script>
import countTo from 'vue-count-to';
export default {
  components: { countTo },
  data () {
    return {
      startVal: 0,
      endVal: 2017
    }
  }
}
</script>
```

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/8b95fac0-6691-4ad6-ba6c-e5d84527da06.gif)

<br/>

## 在 vue 中优雅的使用第三方库

在 Vuejs 项目中使用 JavaScript 库的一个优雅方式是将其代理到 Vue 的原型对象上去. 按照这种方式, 我们引入 Moment 库:

**main.js**

```js
import moment from 'moment'
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
```

由于所有的组件都会从 Vue 的原型对象上继承它们的方法, 因此在所有组件/实例中都可以通过 this.$moment. 的方式访问 Moment 而不需要定义全局变量或者手动的引入:

**MyNewComponent.vue**

```js
export default {
  created() {
    console.log('The time is ', this.$moment().format('HH:mm'))
  }
}
```

在诸多 Vue.js 应用中, Lodash, Moment, Axios, Async 等都是一些非常有用的 JavaScript 库. 但随着项目越来越复杂, 可能会采取组件化和模块化的方式来组织代码, 还可能要使应用支持不同环境下的服务端渲染. 除非你找到了一个简单而又健壮的方式来引入这些库供不同的组件和模块使用, 不然, 这些第三方库的管理会给你带来一些麻烦,这里来介绍一下 Vue.js 中使用第三方库的方式详情见该 [blog](https://github.com/dwqs/blog/issues/51)。

## 自己封装一个非 vue 组件

很多时候我们会发现，有些组件并没有 vue 版本，其实在 vue 中引入第三方组件是很简单的。只要在合适的生命周期里面初始化它就好了。一般在 `mounted`中，之后和正常使用它就没什么区别了。

详细的可见文章：[手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
