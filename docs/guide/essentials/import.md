# Import Third-party Modules

In addition to the element-ui components and the business components built into the scaffolding, sometimes we also need to import other external components.

Here to import [vue-count-to](https://github.com/adempiere/vue-countTo) as an example to introduce.

## Install dependence

Enter the following command in the terminal to complete the installation:

```bash
$ npm install vue-count-to --save
```

> add `--save` will automatically add dependencies to package.json.

<br/>

## Usage

### Global Registration

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

### Local Registration

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

## Use Any Javascript Library With Vue.js

[Use Any Javascript Library With Vue.js](https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/)
