<template>
  <el-menu :collapse="isCollapse" class="el-menu-demo" @select="typeFormat">
    <el-submenu
      index="xlsx"
    >
      <template
        slot="title"
      >
        {{ $t('components.contextMennuWindowReport') }}
      </template>
      <template v-for="(format, index) in option">
        <el-menu-item
          :key="index"
          :index="index"
        >
          {{ format }}
        </el-menu-item>
      </template>
    </el-submenu>
    <el-menu-item
      index="eliminar"
      @click="deleteRecord()"
    >
      {{ $t('window.deleteRecord') }}
    </el-menu-item>
    <el-menu-item
      v-for="(process, key) in isProcessMenu"
      :key="key"
      index="process"
      @click="tableProcess(process)"
    >
      {{ process.name }}
    </el-menu-item>
  </el-menu>
</template>
<script>
import { menuTableMixin } from '@/components/ADempiere/DataTable/menu/mixinMenu'
export default {
  name: 'ContextMenu',
  mixins: [menuTableMixin]
}
</script>
