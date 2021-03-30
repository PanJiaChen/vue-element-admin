<template>
  <div class="container-submenu container-context-menu">
    <el-menu
      ref="contextMenu"
      v-shortkey="shorcutKey"
      :router="false"
      class="el-menu-demo"
      mode="horizontal"
      menu-trigger="hover"
      unique-opened
      @shortkey.native="actionContextMenu"
    >
      <!-- actions or process on container -->
      <el-submenu v-if="!isEmptyValue(actions)" class="el-menu-item" index="actions" @click.native="runAction(actions[0])">
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
            :disabled="panelType === 'browser' ? isEmptyValue(getDataSelection) : action.disabled"
            @click="runAction(action)"
          >
            {{ action.name }}
          </el-menu-item>
        </template>
        <!-- other actions -->
        <el-menu-item v-show="isReport" index="downloadReport">
          <a :href="downloads" :download="file">
            {{ $t('components.contextMenuDownload') }}
          </a>
        </el-menu-item>
        <el-submenu
          v-if="isManageDataRecords"
          :disabled="isDisabledExportRecord"
          index="exportRecord"
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
          v-show="$route.name === 'Report Viewer'"
          index="printFormat"
          @click="redirect"
        >
          {{ $t('components.contextMenuPrintFormatSetup') }}
        </el-menu-item>
        <el-menu-item
          v-if="isManageDataRecords"
          index="refreshData"
          @click="refreshData"
        >
          {{ $t('components.contextMenuRefresh') }}
        </el-menu-item>
        <el-menu-item index="shareLink" @click="setShareLink">
          {{ $t('components.contextMenuShareLink') }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else disabled index="actionsDisabled">
        {{ $t('components.contextMenuActions') }}
      </el-menu-item>

      <!-- menu relations -->
      <el-submenu v-if="!isEmptyChilds" class="el-menu-item" index="1">
        <template slot="title">
          {{ $t('components.contextMenuRelations') }}
        </template>
        <el-scrollbar wrap-class="scroll">
          <items-relations v-for="(relation, index) in relationsList" :key="index" :item="relation" />
        </el-scrollbar>
      </el-submenu>
      <el-menu-item v-else disabled index="relations">
        {{ $t('components.contextMenuRelations') }}
      </el-menu-item>
      <!-- references of record -->
      <el-submenu
        :disabled="!(isReferecesContent && isLoadedReferences)"
        class="el-menu-item"
        index="references"
      >
        <template slot="title">
          {{ $t('components.contextMenuReferences') }}
        </template>
        <template v-if="references && !isEmptyValue(references.referencesList)">
          <el-scrollbar wrap-class="scroll-child">
            <el-menu-item
              v-for="(reference, index) in references.referencesList"
              :key="index"
              :index="reference.displayName"
              @click="openReference(reference)"
            >
              {{ reference.displayName }}
            </el-menu-item>
          </el-scrollbar>
        </template>
        <el-menu-item v-else index="not-references" disabled>
          {{ $t('components.withOutReferences') }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import contextMixin from './contextMenuMixin.js'

export default {
  name: 'ContextMenuDesktop',
  mixins: [
    contextMixin
  ]
}
</script>
