<template>
  <div :id="id" />
</template>

<script>
// deps for editor
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import 'codemirror/lib/codemirror.css' // codemirror
import Editor from 'tui-editor'

import { getLanguage } from '@/lang'
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldTextLong',
  mixins: [fieldMixin],
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

        if (this.isDisabled) {
          this.editor.setValue(value)
        } else {
          this.editor.setValue(oldValue)
        }
      }
    },
    'metadata.value'(value, oldValue) {
      if (!this.metadata.inTable) {
        if (this.isEmptyValue(value)) {
          value = ''
        }
        this.value = String(value)

        if (this.isDisabled) {
          this.editor.setValue(value)
        } else {
          this.editor.setValue(oldValue)
        }
      }
    },
    value(newValue, oldValue) {
      if (newValue !== this.editor.getValue()) {
        if (this.isDisabled) {
          this.editor.setValue(newValue)
        } else {
          this.editor.setValue(oldValue)
        }
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
      // with change event send multiple request to server
      this.editor.on('blur', () => {
        if (!this.isDisabled) {
          this.preHandleChange(this.editor.getValue())
        }
      })
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
