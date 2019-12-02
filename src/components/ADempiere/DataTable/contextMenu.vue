<template>
  <el-menu :collapse="isCollapse" class="el-menu-demo" @select="typeFormat">
    <el-submenu
      index="xlsx"
    >
      <template slot="title">{{ $t('components.contextMennuWindowReport') }}</template>
      <template v-for="(format, index) in option">
        <el-menu-item :key="index" :index="index">
          {{ format }}
        </el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item index="eliminar" style="padding-left: 36px;">
      {{ $t('window.deleteRecord') }}
    </el-menu-item>
  </el-menu>
</template>
<script>
import { supportedTypes, exportFileFromJson } from '@/utils/ADempiere/exportUtil'

export default {
  name: 'ContextMenu',
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    panelType: {
      type: String,
      default: 'window'
    },
    isOption: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: supportedTypes,
      isCollapse: true,
      visible: false
    }
  },
  computed: {
    getterFieldList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    getterFieldListHeader() {
      var header = this.getterFieldList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem.name
        }
      })
      return header.map(fieldItem => {
        return fieldItem.name
      })
    },
    getterFieldListValue() {
      var value = this.getterFieldList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem
        }
      })
      return value.map(fieldItem => {
        if (fieldItem.componentPath === 'FieldSelect') {
          return 'DisplayColumn_' + fieldItem.columnName
        } else {
          return fieldItem.columnName
        }
      })
    },
    gettersRecordContextMenu() {
      var record = []
      var recordTable = this.isOption
      record.push(recordTable)
      return record
    },
    getDataSelection() {
      return this.$store.getters.getDataRecordSelection(this.containerUuid)
    }
  },
  methods: {
    classTableMenu() {
      if (this.isMobile) {
        return 'menu-table-mobile'
      } else if (this.$store.state.app.sidebar.opened) {
        return 'menu-table'
      }
      return 'menu-table'
    },
    typeFormat(key, keyPath) {
      if (key === 'eliminar') {
        this.rowMenu()
      } else {
        this.exporRecordTable(key)
      }
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
    },
    exporRecordTable(key) {
      const Header = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      const list = this.gettersRecordContextMenu
      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header: Header,
        data,
        filename: '',
        exportType: key
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    rowMenu() {
      this.$store.dispatch('deleteEntity', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        recordUuid: this.isOption.UUID,
        panelType: this.panelType,
        isNewRecord: 'deleteEntity' === 'resetPanelToNew'
      })
    }
  }
}
</script>
<style>
.el-menu--vertical .nest-menu .el-submenu>.el-submenu__title:hover, .el-menu--vertical .el-menu-item:hover {
  background-color: #ffffff !important;
  background: #ffffff !important;
}
.el-menu--collapse {
  width: auto;
}
.el-menu-item:hover {
  background-color: #ffffff !important
}
.hover {
  background-color: initial !important;
}
.el-menu-item {
    height: 56px;
    line-height: 56px;
    font-size: 14px;
    color: #303133;
    padding: 0 20px;
    list-style: none;
    cursor: pointer;
    position: relative;
    -webkit-transition: border-color .3s, background-color .3s, color .3s;
    transition: border-color .3s, background-color .3s, color .3s;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
}
</style>
