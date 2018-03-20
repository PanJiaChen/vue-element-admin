<template>
  <div class="components-container">
    <code>Markdown is based on
      <a href="https://github.com/sparksuite/simplemde-markdown-editor" target="_blank">simplemde-markdown-editor</a> ，Simply encapsulated in Vue.
      <a target="_blank" href="https://segmentfault.com/a/1190000009762198#articleHeader14">
        相关文章 </a>
    </code>
    <div class="editor-container">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :zIndex="20"></markdown-editor>
    </div>
    <el-button @click="markdown2Html" style="margin-top:80px;" type="primary" icon="el-icon-document">To HTML</el-button>
    <div v-html="html"></div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'

const content = `
**this is test**

* vue
* element
* webpack

## Simplemde
`

export default {
  name: 'markdown-demo',
  components: { MarkdownEditor },
  data() {
    return {
      content: content,
      html: ''
    }
  },
  methods: {
    markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        this.html = converter.makeHtml(this.content)
      })
    }
  }
}
</script>


