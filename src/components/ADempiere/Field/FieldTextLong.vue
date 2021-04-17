<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <div
    :id="id"
    :class="cssClassStyle"
  />
</template>

<script>
// deps for editor
import 'tui-editor/dist/tui-editor.css' // editor ui
import 'tui-editor/dist/tui-editor-contents.css' // editor content
import 'codemirror/lib/codemirror.css' // codemirror
import Editor from 'tui-editor'

import { getLanguage } from '@/lang'
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import fieldMixinText from '@/components/ADempiere/Field/mixin/mixinFieldText.js'

export default {
  name: 'FieldTextLong',
  mixins: [
    fieldMixin,
    fieldMixinText
  ],
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
    cssClassStyle() {
      let styleClass = ' custom-field-text-long '
      if (this.isDisabled) {
        styleClass += ' custom-field-text-long-disable '
      }
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
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

<style scoped>
  .custom-field-text-long-disable {
    background: #F5F7FA;
  }
</style>
<style lang="scss">
  .tui-editor .te-preview-style-vertical .te-md-splitter {
    display: table;
    width: 100%;
  }
</style>
