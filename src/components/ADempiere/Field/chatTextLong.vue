<template>
  <div :id="id" :class="classDisable" />
</template>

<script>
// deps for editor
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import 'codemirror/lib/codemirror.css' // codemirror
import Editor from 'tui-editor'

import { getLanguage } from '@/lang'
// import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'ChatTextLong',
  //   mixins: [fieldMixin],
  props: {
    id: {
      type: String,
      required: false,
      default() {
        return 'markdown-editor-' + +new Date() + ((Math.random() * 1000).toFixed(0))
      }
    }
  },
  data() {
    return {
      mode: 'markdown', // 'markdown' or 'wysiwyg'
      height: '200px',
      editor: null
    }
  },
  computed: {
    classDisable() {
      if (this.isDisabled) {
        return 'isdisable'
      }
      return ''
    },
    clean() {
      return this.$store.getters.getMarkDown
    },
    language() {
      // https://github.com/nhnent/tui.editor/tree/master/src/js/langs
      if (this.isEmptyValue(getLanguage())) {
        return 'en_US'
      }
      return getLanguage()
    },
    editorOptions() {
      const options = {
        previewStyle: 'vertical',
        useCommandShortcut: true,
        usageStatistics: false, // send hostname to google analytics
        hideModeSwitch: this.isDisabled
      }
      options.initialEditType = this.mode
      options.height = this.height
      options.language = this.language
      return options
    }
  },
  watch: {
    valueModel(value, oldValue) {
      if (this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        this.value = String(value)
      }
    },
    clean(value) {
      if (value) {
        this.editor.setValue('')
      }
    },
    'metadata.value'(value, oldValue) {
      if (!this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        this.value = String(value)
      }
    },
    value(newValue, oldValue) {
      if (this.isDisabled) {
        // not changed value
        this.value = oldValue
        this.editor.setValue(oldValue)
      } else {
        this.editor.setValue(newValue)
      }
    },
    language(langValue) {
      this.destroyEditor()
      this.initEditor()
    },
    height(heightValue) {
      this.editor.height(heightValue)
    },
    isDisabled(value) {
      this.classDisable
      this.destroyEditor()
      this.initEditor()
    }
  },
  mounted() {
    this.initEditor()
  },
  destroyed() {
    this.destroyEditor()
  },
  methods: {
    initEditor() {
      this.editor = new Editor({
        el: document.getElementById(this.id),
        ...this.editorOptions
      })
      if (!this.isEmptyValue(this.value)) {
        this.editor.setValue(this.value)
      }
      this.setEvents()
    },
    setEvents() {
      if (this.isDisabled) {
        this.removeEventSendValues()
        this.addReanOnlyChanges()
      } else {
        this.addEventSendValues()
        this.removeReadOnlyChanges()
      }
    },
    addEventSendValues() {
      this.editor.on('blur', () => {
        this.preHandleChange(this.editor.getValue())
      })
    },
    preHandleChange(value) {
      var comment = value
      if (this.clean) {
        this.$store.dispatch('setchatText', comment)
          .then((responseComment) => {
            this.$store.dispatch('setMarkDown', false)
            this.$store.dispatch('setchatText', '')
          })
      } else {
        this.$store.dispatch('setchatText', comment)
      }
    },
    addReanOnlyChanges() {
      this.editor.on('change', () => {
        this.editor.setValue(this.value)
      })
    },
    removeEventSendValues() {
      this.editor.off('blur')
    },
    removeReadOnlyChanges() {
      this.editor.off('change')
    },
    destroyEditor() {
      if (!this.editor) {
        return
      }
      this.removeEventSendValues()
      this.removeReadOnlyChanges()
      this.editor.remove()
    },
    setHtml(value) {
      this.editor.setHtml(value)
    },
    getHtml() {
      return this.editor.getHtml()
    }
  }
}
</script>
<style>
  .isdisable {
    background: #F5F7FA;
  }
</style>
