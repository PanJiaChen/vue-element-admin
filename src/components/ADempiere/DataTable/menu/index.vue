<template>
  <el-menu :default-active="menuTable" :class="classTableMenu + ' menu-table-container'" mode="horizontal" @select="typeFormat">
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-more" />
      </template>
      <el-menu-item
        v-if="!isParent && isPanelWindow"
        :disabled="isDisabledAddNew"
        @click="addNewRow()"
      >
        {{ $t('window.newRecord') }}
      </el-menu-item>
      <el-menu-item
        v-if="isPanelWindow"
        :disabled="Boolean(getDataSelection.length < 1 || (isReadOnlyParent && !isParent))"
        @click="deleteSelection()"
      >
        {{ $t('table.dataTable.deleteSelection') }}
      </el-menu-item>
      <el-menu-item
        v-for="(process, key) in isProcessMenu"
        v-show="isPanelWindow && isProcessMenu"
        :key="key"
        :disabled="Boolean(getDataSelection.length < 1)"
        index="process"
        @click="tableProcess(process)"
      >
        {{ process.name }}
      </el-menu-item>
      <el-menu-item
        @click="exporZipRecordTable"
      >
        {{ $t('table.dataTable.exportZip') }}
      </el-menu-item>
      <el-submenu
        :disabled="Boolean(getDataSelection.length < 1)"
        index="xlsx"
      >
        <template slot="title">{{ $t('table.dataTable.exportRecordTable') }}</template>
        <template v-for="(format, index) in option">
          <el-menu-item :key="index" :index="index">
            {{ format }}
          </el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item index="optional" @click="optionalPanel()">
        {{ $t('components.filterableItems') }}
      </el-menu-item>
      <el-menu-item index="mandatory" @click="showOnlyMandatoryColumns()">
        {{ $t('table.dataTable.showOnlyMandatoryColumns') }}
      </el-menu-item>
      <el-menu-item index="available" @click="showAllAvailableColumns()">
        {{ $t('table.dataTable.showAllAvailableColumns') }}
      </el-menu-item>
      <el-menu-item
        v-if="['browser', 'window'].includes(panelType)"
        @click="showTotals()"
      >
        {{ isPanel.isShowedTotals ? $t('table.dataTable.hiddenTotal') : $t('table.dataTable.showTotal') }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
import { menuTableMixin } from '@/components/ADempiere/DataTable/menu/mixinMenu'
export default {
  name: 'TableMenu',
  mixins: [menuTableMixin]
}
</script>
<style>
.el-menu--vertical .nest-menu .el-submenu>.el-submenu__title:hover, .el-menu--vertical .el-menu-item:hover {
  background-color: #74bcff94 !important;
  background: #74bcff94 !important;
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
