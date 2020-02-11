<template>
  <el-menu
    :collapse="isCollapse"
    class="el-menu-demo"
    @select="exporRecordTable"
  >
    <el-submenu
      index="xlsx"
    >
      <template
        slot="title"
      >
        {{ $t('data.exportRecord') }}
      </template>
      <template v-for="(format, index) in supportedTypes">
        <el-menu-item
          :key="index"
          :index="index"
        >
          {{ format }}
        </el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item
      index="delete"
      @click="deleteRecord()"
    >
      {{ $t('window.deleteRecord') }}
    </el-menu-item>
    <el-menu-item
      v-for="(process, key) in processMenu"
      :key="key"
      index="process"
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
  }
}
</script>
