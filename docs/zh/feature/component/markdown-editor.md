# Markdown 编辑器 <Badge text="v3.9.3+"/>

本来使用 [simplemde-markdown-editor](https://github.com/sparksuite/simplemde-markdown-editor) 作为 markdown 编辑器，但这个库很久不更新和维护了，而且还有 xss 风险。所以在 <Badge text="v3.9.3+"/> 版本之后使用 [tui.editor](https://github.com/nhnent/tui.editor)作为新的编辑器，接下来所有的文档都是基于 tui.editor 它的。[更多内容](https://github.com/nhnent/tui.editor)。

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
