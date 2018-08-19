<template>
  <div :style="{height:height+'px',zIndex:zIndex}" class="simplemde-container">
    <textarea :id="id"/>
  </div>
</template>

<script>
import 'font-awesome/css/font-awesome.min.css'
import 'simplemde/dist/simplemde.min.css'
import SimpleMDE from 'simplemde'

export default {
  name: 'SimplemdeMd',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: false,
      default: 'markdown-editor-' + +new Date()
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 150
    },
    zIndex: {
      type: Number,
      default: 10
    },
    toolbar: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      simplemde: null,
      hasChange: false
    }
  },
  watch: {
    value(val) {
      if (val === this.simplemde.value() && !this.hasChange) return
      this.simplemde.value(val)
    }
  },
  mounted() {
    this.simplemde = new SimpleMDE({
      element: document.getElementById(this.id),
      autoDownloadFontAwesome: false,
      autofocus: this.autofocus,
      toolbar: this.toolbar.length > 0 ? this.toolbar : undefined,
      spellChecker: false,
      insertTexts: {
        link: ['[', ']( )']
      },
      // hideIcons: ['guide', 'heading', 'quote', 'image', 'preview', 'side-by-side', 'fullscreen'],
      placeholder: this.placeholder
    })
    if (this.value) {
      this.simplemde.value(this.value)
    }
    this.simplemde.codemirror.on('change', () => {
      if (this.hasChange) {
        this.hasChange = true
      }
      this.$emit('input', this.simplemde.value())
    })
  },
  destroyed() {
    this.simplemde.toTextArea()
    this.simplemde = null
  }
}
</script>

<style scoped>
.simplemde-container>>>.CodeMirror {
  min-height: 150px;
  line-height: 20px;
}

.simplemde-container>>>.CodeMirror-scroll {
  min-height: 150px;
}

.simplemde-container>>>.CodeMirror-code {
  padding-bottom: 40px;
}

.simplemde-container>>>.editor-statusbar {
  display: none;
}

.simplemde-container>>>.CodeMirror .CodeMirror-code .cm-link {
  color: #1890ff;
}

.simplemde-container>>>.CodeMirror .CodeMirror-code .cm-string.cm-url {
  color: #2d3b4d;
}

.simplemde-container>>>.CodeMirror .CodeMirror-code .cm-formatting-link-string.cm-url {
  padding: 0 2px;
  color: #E61E1E;
}
.simplemde-container >>> .editor-toolbar.fullscreen,
.simplemde-container >>> .CodeMirror-fullscreen {
  z-index: 1003;
}
</style>
