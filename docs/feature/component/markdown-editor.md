# Markdown Editor <Badge text="v3.9.3+"/>

Originally used [simplemde-markdown-editor](https://github.com/sparksuite/simplemde-markdown-editor) as the markdown editor, but this library has not been updated and maintained for a long time, and there is also the risk of xss. So after the <Badge text="v3.9.3+"/> version, use [tui.editor](https://github.com/nhnent/tui.editor) as the new editor. All the next documents are Based on tui.editor it. [More Content](https://github.com/nhnent/tui.editor).

## Props

| Name     | Type   | Default                    | Description                                                                           |
| -------- | ------ | -------------------------- | ------------------------------------------------------------------------------------- |
| value    | String | " "                        | This prop can change content of the editor. **If you using `v-model`, don't use it**. |
| options  | Object | following `defaultOptions` | Options of tui.editor. This is for initailize tui.editor.                             |
| height   | String | '300px'                    | This prop can control the height of the editor.                                       |
| mode     | String | 'markdown'                 | This prop can change mode of the editor. (`markdown`or `wysiwyg`)                     |
| language | String | 'en_US'                    | i18n                                                                                  |

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

## Methods

- setValue
- getValue
- setHtml
- getHtml

## Example

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

## Online Example

[link](https://adempiere.github.io/adempiere-vue/#/components/markdown)
