# Estilo

## Módulos CSS

En el proceso de desarrollo del estilo, hay dos cuestiones más destacadas:

- Contaminación global —— El selector en el archivo CSS es global. Si el mismo nombre del selector esta en diferentes archivos, de acuerdo con el orden en el archivo de generación de compilación, los estilos generados más adelante sobrescribirán los anteriores.

- Selector complejo —— Para evitar los problemas anteriores, debemos tener cuidado al escribir estilos, el nombre de la clase estará marcado con una serie de restricciones, el desarrollo entre varias personas también es muy fácil de conducir al caos con los nombres de los estilos. Los nombres de las clases son cada vez más largos. Eventualmente, es difícil de mantener.

Afortunadamente, vue nos proporciona [scoped](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles) el cual puede resolver fácilmente el problema anterior. Como su nombre indica, agrega un concepto de alcance (scoped) al css.

```css
/* Antes de compilar */
.example {
  color: red;
}

/* Despues de compilar */
.example[_v-f3f3eg9] {
  color: red;
}
```

Si agregas `<style scoped>` el css solo tendrá efecto en el componente actual. Para obtener documentación detallada, consulta [vue-loader](https://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles)

::: tip
Con scoped, los estilos del componente principal no se filtrarán a los componentes secundarios. Sin embargo, el nodo raíz de un componente secundario se verá afectado tanto por el CSS con scoped del padre como por el CSS con scoped del hijo. Esto es así para que el padre pueda aplicar estilo al elemento raíz hijo con fines de diseño.
:::

<br/>

## Estructura del proyecto

Todos los estilos globales de adempiere-vue se configuran en el directorio `@/styles`.

```bash
├── styles
│   ├── btn.scss                 # botones css
│   ├── element-ui.scss          # estilo global personalizado de element-ui
│   ├── index.scss               # estilo global común
│   ├── mixin.scss               # global sass mixin
│   ├── sidebar.scss             # barra lateral css
│   ├── transition.scss          # animación de transición de vue
│   └── variables.scss           # variables globales
```

El flujo de trabajo común es que los estilos globales se escriban en el directorio `src/styles` y el estilo propio de cada página se escriba en su propio archivo `.vue`.

```css
<style>
/* estilos globales */
</style>

<style scoped>
/* estilos locales */
</style>
```

## Estilo de element-ui personalizado

Ahora hablemos sobre cómo sobrescribir el estilo de element-ui. Debido a que el estilo de element-ui esta importado de manera global, no puedes agregar `scoped` a una página para sobrescribirlo, en caso de que quieras sobrescribir el estilo de element solamente en esa página, puedes agregar una clase en su padre, utilizando espacio de nombres para resolver este problema.

```css
.article-page {
  /* tu espacio de nombres */
  .el-tag {
    /* etiqueta del elemento de element-ui */
    margin-right: 0px;
  }
}
```

**Por supuesto, también puedes usar los selectores profundos como se describe a continuación.**

## Selectores profundos

**El componente principal cambia el estilo del componente secundario.**

Si quieres que un selector en estilos con scoped sea "profundo", es decir, que afecte a los componentes secundarios, puedes usar el combinador `>>>`:

```css
<style scoped>
.a >>> .b { /* ... */ }
</style>
```

Se compilará como:

```css
.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

Es posible que algunos preprocesadores, como SASS, no puedan analizar `>>>` correctamente. En esos casos, puedes usar el combinador /deep/ en su lugar, es un alias para `>>>` y funciona exactamente igual.

```css
.xxx-container >>> .el-button{
  xxxx
}
```

[Documentación oficial](https://vue-loader.vuejs.org/en/features/scoped-css.html)

## Postcss

Hablemos de la configuración de postcss. Después de la nueva versión de la inicialización [plantilla vue-cli de webpack](https://github.com/vuejs-templates/webpack), hay un `postcss.config.js` predeterminado en el directorio raíz. Por defecto, `vue-loader` leerá la configuración de postcss, así que aquí puede cambiar la configuración directamente. La configuración es la misma que [postcss](https://github.com/postcss/postcss).

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

Como se describe en el código anterior, el corrector automático lee los parámetros de configuración de browserslist en package.json.

- `> 1%` Compatible con navegadores con uso global superior al 1%
- `last 2 versions` Compatible con las dos últimas versiones de cada navegador
- `not ie <= 8` No compatible con ie8 e inferiores

Más detalles [browserslist](https://github.com/ai/browserslist)

`postcss` tiene muchas otras características [para explorar por tu cuenta](https://www.postcss.parts/)

## Mixin

Este proyecto no está configurado para inyectar automáticamente sass mixin en el estilo global, por lo que debes insertarlo manualmente.

```scss
<style rel="stylesheet/scss" lang="scss">
  @import "src/styles/mixin.scss";
</style>
```

Si necesitas inyectar automáticamente mixin global, puedes usar [sass-resources-loader](https://github.com/shakacode/sass-resources-loader).
