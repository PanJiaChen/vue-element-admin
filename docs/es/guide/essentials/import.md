# Importar Módulos de Terceros

Además de los componentes de element-ui y los componentes comerciales integrados en el andamio, a veces también necesitamos importar otros componentes externos.

Aquí para importar [vue-count-to](https://github.com/adempiere/vue-countTo) como ejemplo para introducir.

## Instalar dependencia

Ingresa el siguiente comando en la terminal para completar la instalación:

```bash
$ npm install vue-count-to --save
```

> al añadir `--save` se agregarán automáticamente las dependencias a package.json.

<br/>

## Uso

### Registro global

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

### Registro local

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

## Utiliza cualquier biblioteca de Javascript con Vue.js

[Utiliza cualquier biblioteca de Javascript con Vue.js](https://vuejsdevelopers.com/2017/04/22/vue-js-libraries-plugins/)
