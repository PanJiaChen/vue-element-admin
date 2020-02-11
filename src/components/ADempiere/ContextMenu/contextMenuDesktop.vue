<template>
  <div class="container-submenu container-context-menu">
    <el-menu
      v-shortkey="{ f2: ['f2'], f3: ['f3'], f5: ['f5'], f3:['ctrl', 'd'] }"
      :default-active="activeMenu"
      :router="false"
      class="el-menu-demo"
      mode="horizontal"
      menu-trigger="hover"
      unique-opened
      @select="typeFormat"
      @shortkey.native="actionContextMenu"
    >
      <template>
        <el-submenu v-if="!isEmptyValue(relationsList)" class="el-menu-item" index="1">
          <template slot="title">
            {{ $t('components.contextMenuRelations') }}
          </template>
          <el-scrollbar wrap-class="scroll">
            <item v-for="(relation, index) in relationsList" :key="index" :item="relation" />
          </el-scrollbar>
        </el-submenu>
        <el-menu-item v-else disabled index="1">
          {{ $t('components.contextMenuRelations') }}
        </el-menu-item>
        <el-submenu v-if="actions !== undefined && actions.length" class="el-menu-item" index="2" @click.native="runAction(actions[0])">
          <template slot="title">
            {{ $t('components.contextMenuActions') }}
          </template>
          <template v-for="(action, index) in actions">
            <el-submenu v-if="action.childs" :key="index" :index="action.name" :disabled="action.disabled">
              <template slot="title">
                {{ action.name }}
              </template>
              <el-scrollbar wrap-class="scroll-child">
                <el-menu-item
                  v-for="(child, key) in action.childs"
                  :key="key"
                  :index="child.uuid"
                  @click="runAction(child)"
                >
                  {{ child.name }}
                </el-menu-item>
              </el-scrollbar>
            </el-submenu>
            <el-menu-item
              v-else
              v-show="!action.hidden"
              :key="index"
              :index="action.name"
              :disabled="action.disabled"
              @click="runAction(action)"
            >
              {{ action.name }}
            </el-menu-item>
          </template>
          <el-menu-item v-show="isReport" index="4">
            <a :href="downloads" :download="file">
              {{ $t('components.contextMenuDownload') }}
            </a>
          </el-menu-item>
          <el-submenu
            v-if="getDataSelection.length > 0 && panelType === 'browser'"
            :disabled="Boolean(getDataSelection.length < 1)"
            index="xlsx"
            @click.native="exporBrowser('xlsx')"
          >
            <template slot="title">
              {{ $t('components.contextMennuWindowReport') }}
            </template>
            <template v-for="(format, index) in option">
              <el-menu-item :key="index" :index="index">
                {{ format }}
              </el-menu-item>
            </template>
          </el-submenu>
          <el-submenu
            v-if="panelType === 'window'"
            index="xlsx"
            @click.native="exporWindow('xlsx')"
          >
            <template slot="title">
              {{ $t('components.contextMennuWindowReport') }}
            </template>
            <template v-for="(format, index) in option">
              <el-menu-item :key="index" :index="index">
                {{ format }}
              </el-menu-item>
            </template>
          </el-submenu>
          <el-menu-item v-show="$route.name === 'Report Viewer'" index="9" @click="redirect">
            {{ $t('components.contextMenuPrintFormatSetup') }}
          </el-menu-item>
          <el-menu-item v-if="panelType !== 'process'" index="8" @click="refreshData">
            {{ $t('components.contextMenuRefresh') }}
          </el-menu-item>
          <el-menu-item index="5" @click="setShareLink">
            {{ $t('components.contextMenuShareLink') }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else disabled index="2">
          {{ $t('components.contextMenuActions') }}
        </el-menu-item>
        <el-submenu :disabled="!(isReferecesContent && isLoadedReferences)" class="el-menu-item" index="3">
          <template slot="title">
            {{ $t('components.contextMenuReferences') }}
          </template>
          <template v-if="references && !isEmptyValue(references.referencesList)">
            <el-scrollbar wrap-class="scroll-child">
              <el-menu-item
                v-for="(reference, index) in references.referencesList"
                :key="index"
                :index="reference.displayName"
                @click="runAction(reference)"
              >
                {{ reference.displayName }}
              </el-menu-item>
            </el-scrollbar>
          </template>
          <el-menu-item v-else index="not-references" disabled>
            {{ $t('components.withOutReferences') }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { contextMixin } from '@/components/ADempiere/ContextMenu/contextMenuMixin'

export default {
  name: 'ContextMenuDesktop',
  mixins: [contextMixin]
}
</script>
