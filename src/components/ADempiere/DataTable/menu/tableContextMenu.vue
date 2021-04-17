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
    :collapse="isCollapse"
  >
    <el-submenu
      index="xlsx"
      @click.native="exporRecordTable(defaultFromatExport)"
    >
      <template slot="title">
        {{ $t('data.exportRecord') }}
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
    <el-menu-item
      @click="exporZipRecordTable({
        recordContexMenu: true
      })"
    >
      {{ $t('table.dataTable.exportZip') }}
    </el-menu-item>
    <el-menu-item
      v-if="panelType === 'window'"
      index="delete"
      @click="deleteRecord()"
    >
      {{ $t('window.deleteRecord') }}
    </el-menu-item>

    <!-- process associated -->
    <el-menu-item
      v-for="(process, key) in processMenu"
      :key="key"
      :index="'process' + key"
      @click="showModalTable(process)"
    >
      {{ process.name }}
    </el-menu-item>
  </el-menu>
</template>

<script>
import menuTableMixin from './menuTableMixin.js'

export default {
  name: 'TableContextMenu',
  mixins: [menuTableMixin],
  data() {
    return {
      menuType: 'tableContextMenu'
    }
  },
  methods: {
    deleteRecord() {
      this.$store.dispatch('deleteEntity', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        row: this.currentRow
      })
    }
  }
}
</script>
