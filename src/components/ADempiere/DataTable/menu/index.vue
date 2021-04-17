<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <el-menu
    :default-active="menuTable"
    :class="classTableMenu + ' menu-table-container'"
    mode="horizontal"
  >
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
        :disabled="isEmptyValue(getDataSelection) || (isReadOnlyParent && !isParent)"
        @click="deleteSelection()"
      >
        {{ $t('table.dataTable.deleteSelection') }}
      </el-menu-item>
      <template v-if="isPanelWindow && !isEmptyValue(processMenu)">
        <el-menu-item
          v-for="(process, key) in processMenu"
          :key="key"
          :disabled="process.type === 'application' ? false : isEmptyValue(getDataSelection)"
          :index="'process' + key"
          @click="showModalTable(process)"
        >
          {{ process.name }}
        </el-menu-item>
      </template>
      <el-menu-item
        @click="exporZipRecordTable"
      >
        {{ $t('table.dataTable.exportZip') }}
      </el-menu-item>
      <el-submenu
        :disabled="isEmptyValue(getDataSelection)"
        index="xlsx"
        @click.native="exporRecordTable(defaultFromatExport)"
      >
        <template slot="title">
          {{ $t('table.dataTable.exportRecordTable') }}
        </template>
        <el-menu-item
          v-for="(format, keyFormat) in supportedTypes"
          :key="keyFormat"
          :index="keyFormat"
          @click.native="exporRecordTable(keyFormat)"
        >
          {{ format }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="optional" @click="showOptionalColums()">
        {{ $t('components.filterableItems') }}
      </el-menu-item>
      <el-menu-item index="mandatory" @click="showOnlyMandatoryColumns()">
        {{ $t('table.dataTable.showOnlyMandatoryColumns') }}
      </el-menu-item>
      <el-menu-item index="available" @click="showAllAvailableColumns()">
        {{ $t('table.dataTable.showAllAvailableColumns') }}
      </el-menu-item>
      <el-menu-item
        :disabled="isFieldsQuantity"
        @click="showTotals()"
      >
        {{ panelMetadata.isShowedTotals ? $t('table.dataTable.hiddenTotal') : $t('table.dataTable.showTotal') }}
      </el-menu-item>
      <el-menu-item
        v-if="!isPanelWindow"
        :disabled="isEmptyValue(getDataSelection)"
        index="zoom-record"
        @click="zoomRecord()"
      >
        {{ $t('table.ProcessActivity.zoomIn') }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import menuTableMixin from './menuTableMixin.js'

export default {
  name: 'TableMainMenu',
  mixins: [menuTableMixin],
  data() {
    return {
      menuType: 'tableMainMenu'
    }
  }
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
