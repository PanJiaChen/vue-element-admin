<template>
  <div class="components-container">
    <code>Markdown 我们这里选用了 <a href="https://github.com/sparksuite/simplemde-markdown-editor" target="_blank">simplemde-markdown-editor</a> ，简单的用vue封装了一下<a target='_blank' href='https://segmentfault.com/a/1190000009762198#articleHeader14'> 相关文章 </a></code>
    <div class="editor-container">
      <md-editor id='contentEditor' ref="contentEditor" v-model='content' :height="300" :zIndex='20'></md-editor>
    </div>
    <el-button @click='markdown2Html' style="margin-top:80px;" type="primary">转为HTML<i class="el-icon-document el-icon--right"></i></el-button>
    <div v-html="html"></div>
  </div>
</template>

<script>
import MdEditor from '@/components/MarkdownEditor'

export default {
  components: { MdEditor },
  data() {
    return {
      content: '## Simplemde',
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


