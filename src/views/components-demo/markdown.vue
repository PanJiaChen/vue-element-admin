<template>
  <div class="components-container">
    <code>Markdown is based on
      <a href="https://github.com/sparksuite/simplemde-markdown-editor" target="_blank">simplemde-markdown-editor</a> ，Simply encapsulated in Vue.
      <a target="_blank" href="https://juejin.im/post/593121aa0ce4630057f70d35#heading-15">
        相关文章 </a>
    </code>
    <div class="editor-container">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :z-index="20"/>
    </div>
    <el-button style="margin-top:80px;" type="primary" icon="el-icon-document" @click="markdown2Html">To HTML</el-button>
    <div v-html="html"/>
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
  name: 'MarkdownDemo',
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

