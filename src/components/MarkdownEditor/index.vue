<template>
  <div>
    <editor ref="toastuiEditor" :options="editorOptions" height="500px" @load="onEditorLoad" @change="onEditorChange" />
  </div>
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor.css'

import { Editor } from '@toast-ui/vue-editor'

export default {
  components: {
    editor: Editor
  },
  data() {
    return {
      editorText: '',
      editorOptions: {
        hideModeSwitch: true
      }
    }
  },
  mounted() {
    console.log(this.$route.query.editorText)
  },
  beforeDestroy() {
  },
  methods: {
    onEditorLoad(editor) {
      editor.setMarkdown(this.$route.query.editorText, true)
    },
    onEditorChange() {
      const query = JSON.parse(JSON.stringify(this.$route.query)) // 获取路由参数信息
      this.$nextTick(() => {
        query.editorText = this.$refs.toastuiEditor.invoke('getMarkdown') // 改变参数
        this.$router.push({ path: this.$route.path, query }) // 更新路由
      })
    }
  }
}
</script>
