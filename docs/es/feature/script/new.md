# Nuevo <Badge text="v4.0.0+"/>

En el trabajo diario, lo más común es escribir módulos y componentes comerciales. Cada vez que necesitas una nueva `vista` o `componente` debes crear manualmente un nuevo `.vue`, crear un `<template>`, `<script>`, `<style>`, o algún problema.

Así que en la nueva versión, basada en [plop](https://github.com/amwmedia/plop), se proporcionan varias plantillas básicas para facilitar la creación de una nueva `vista` o `componente`.

Ejecuta el siguiente comando:

```bash
npm run new
```

![plop](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/5f8ea239-aaa5-4e91-9d09-ed56b33a110d.gif)

Como se muestra en el gif anterior, es fácil generar el fragmento de código básico que quiero simplemente presionando Enter varias veces. Esto es solo una demostración, puedes personalizar la plantilla según tus necesidades.

Para requisitos de plantilla adicionales, puedes crear una plantilla personalizada siguiendo la documentación de `plop` y dirigiéndote al directorio `plop-templates`.

De hecho, esta característica es similar a lo que hacen los `snippets`. Si crees que la configuración es demasiado complicada, puedes instalar un fragmento de código basado en VSCode como [Vue 2 Snippets](https://marketplace.visualstudio.com/items?itemName=hollowtree.vue-snippets).
