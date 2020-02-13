<template>
  <el-menu
    :collapse="isCollapse"
  >
    <el-submenu
      index="xlsx"
      @click.native="exportRecord(defaultFromatExport)"
    >
      <template slot="title">
        {{ $t('data.exportRecord') }}
      </template>
      <el-menu-item
        v-for="(format, keyFormat) in supportedTypes"
        :key="keyFormat"
        :index="keyFormat"
        @click.native="exportRecord(keyFormat)"
      >
        {{ format }}
      </el-menu-item>
    </el-submenu>
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
import { menuTableMixin } from '@/components/ADempiere/DataTable/menu/menuTableMixin'

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
