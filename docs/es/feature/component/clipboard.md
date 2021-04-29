---
sidebarDepth: 3
---

# Portapapeles

Aquí está el copiar y pegar basado en [portapapeles](https://github.com/zenorocha/clipboard.js)

Este proyecto ofrece dos maneras de usarlo.

## Usar directamente

```html
<el-button @click='handleCopy(inputData,$event)'>copiar</el-button>
```

```js
import clip from '@/utils/clipboard.js' // usar el portapapeles directamente

methods: {
  handleCopy(text, event) {
    clip(text, event)
  }
}
```

En primer lugar, importa `clipboard.js` y configura la función `click`.

`clip()` El primer parámetro es el contenido a copiar, el segundo parámetro es el evento event. Ambos parámetros son necesarios.

<br/>
<br/>

## v-directive

Este proyecto también encapsula un `v-clipboard`.

```html
 <el-button
   v-clipboard:copy='inputData'
   v-clipboard:success='clipboardSuccess'>
   copiar
</el-button>
```

```js
import clipboard from '@/directive/clipboard/index.js' // usar el portapapeles por v-directive

directives: {
  clipboard
},
methods: {
  clipboardSuccess() {
    this.$message({
      message: 'Copiado exitosamente',
      type: 'success',
      duration: 1500
    })
  }
}
```

`v-clipboard:copy`: La copia del contenido.

`v-clipboard:success`: Función de devolución de llamada de éxito (callback).
