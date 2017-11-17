<template>
  <div class="components-container">
    <code>Markdown 我们这里选用了
      <a href="https://github.com/sparksuite/simplemde-markdown-editor" target="_blank">simplemde-markdown-editor</a> ，简单的用vue封装了一下
      <a target="_blank" href="https://segmentfault.com/a/1190000009762198#articleHeader14">
      相关文章 </a>
    </code>
    <div class="editor-container">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="content" :height="300" :zIndex="20"></markdown-editor>
    </div>
    <el-button @click="markdown2Html" style="margin-top:80px;" type="primary" icon="el-icon-document">转为HTML</el-button>
    <div v-html="html"></div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'markdown-demo',
  components: { MarkdownEditor },
  data() {
    return {
      content: '## Simplemde',
      html: ''
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.app.cachedViews
    }
  },
  // deactivated() {
  //   console.log(this.cachedViews.indexOf(this.$route.name))
  //   if (this.cachedViews.indexOf(this.$route.name) < 0) {
  //     this.$destroy()
  //   }
  // },
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


