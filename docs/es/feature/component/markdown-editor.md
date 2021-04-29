# Editor Markdown <Badge text="v3.9.3+"/>

Originalmente utilizado [simplemde-markdown-editor](https://github.com/sparksuite/simplemde-markdown-editor) como editor de markdown, pero esta biblioteca no se ha actualizado ni mantenido desde hace mucho tiempo, y también existe el riesgo de xss. Así que después de la versión <Badge text="v3.9.3+"/>, usa [tui.editor](https://github.com/nhnent/tui.editor) como el nuevo editor. Todos los documentos siguientes están basados en tui.editor. [Más contenido](https://github.com/nhnent/tui.editor).

## Propiedades

| Nombre   | Tipo   | Predeterminado             | Descripción                                                                                      |
| -------- | ------ | -------------------------- | ------------------------------------------------------------------------------------------------ |
| value    | String | " "                        | Esta propiedad puede cambiar el contenido del editor. **Si estás usando `v-model`, no lo uses**. |
| options  | Object | following `defaultOptions` | Opciones de tui.editor. Esto es para inicializar tui.editor.                                     |
| height   | String | '300px'                    | Esta propiedad puede controlar la altura del editor.                                             |
| mode     | String | 'markdown'                 | Esta propiedad puede cambiar el modo del editor. (`markdown`or `wysiwyg`)                        |
| language | String | 'en_US'                    | i18n                                                                                             |

```js
const defaultOptions = {
  minHeight: '200px',
  previewStyle: 'vertical',
  useCommandShortcut: true,
  useDefaultHTMLSanitizer: true,
  usageStatistics: false,
  hideModeSwitch: false,
  toolbarItems: [
    'heading',
    'bold',
    'italic',
    'strike',
    'divider',
    'hr',
    'quote',
    'divider',
    'ul',
    'ol',
    'task',
    'indent',
    'outdent',
    'divider',
    'table',
    'image',
    'link',
    'divider',
    'code',
    'codeblock'
  ]
}
```

## Métodos

- setValue
- getValue
- setHtml
- getHtml

## Ejemplo

```html
  <template>
    <markdown-editor v-model="content" />
  </template>
  <script>
  import MarkdownEditor from '@/components/MarkdownEditor'

  export default {
    data() {
      return {
        content: '',
      }
    }
  }
  </script>
```

## Ejemplo en Linea

[enlace](https://adempiere.github.io/adempiere-vue/#/components/markdown)
