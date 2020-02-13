<template>
  <div class="container-submenu-mobile container-context-menu">
    <right-menu>
      <el-menu
        ref="contextMenu"
        v-shortkey="{ f2: ['f2'], f3: ['f3'], f5: ['f5'], f3:['ctrl', 'd'] }"
        :default-active="activeMenu"
        :router="false"
        class="el-menu-demo"
        mode="vertical"
        menu-trigger="hover"
        unique-opened
        style="width: 258px; float: right;"
      >
        <el-submenu index="relations">
          <template slot="title">
            <svg-icon icon-class="tree" />
            {{ $t('components.contextMenuRelations') }}
          </template>
          <el-menu-item-group>
            <el-scrollbar wrap-class="scroll">
              <item v-for="(relation, index) in relationsList" :key="index" :item="relation" />
            </el-scrollbar>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="actions">
          <template slot="title">
            <svg-icon icon-class="link" />
            {{ $t('components.contextMenuActions') }}
          </template>
          <el-menu-item-group>
            <el-scrollbar wrap-class="scroll">
              <template v-for="(action, index) in actions">
                <el-submenu
                  v-if="action.childs"
                  :key="index"
                  :index="action.name"
                  :disabled="action.disabled"
                >
                  <template slot="title">
                    {{ action.name }}
                  </template>
                  <el-menu-item
                    v-for="(child, key) in action.childs"
                    :key="key"
                    :index="child.uuid"
                    @click="runAction(child)"
                  >
                    {{ child.name }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  v-else
                  :key="index"
                  :index="action.name"
                  :disabled="action.disabled"
                  @click="runAction(action)"
                >
                  <svg-icon v-if="action.type === 'process'" icon-class="component" />
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
              >
                <template slot="title">
                  {{ $t('data.exportRecord') }}
                </template>
                <el-menu-item v-for="(format, keyFormat) in supportedTypes" :key="keyFormat" :index="keyFormat" @click.native="exportRecord(keyFormat)">
                  {{ format }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-show="$route.name === 'Report Viewer'" index="printFormat" @click="redirect">
                {{ $t('components.contextMenuPrintFormatSetup') }}
              </el-menu-item>
              <el-menu-item v-if="isManageDataRecords" index="refreshData" @click="refreshData">
                {{ $t('components.contextMenuRefresh') }}
              </el-menu-item>
              <el-menu-item index="shareLink" @click="setShareLink">
                {{ $t('components.contextMenuShareLink') }}
              </el-menu-item>
            </el-scrollbar>
          </el-menu-item-group>
        </el-submenu>

        <el-submenu :disabled="!(isReferecesContent && isLoadedReferences)" class="el-menu-item" index="references">
          <template slot="title">
            {{ $t('components.contextMenuReferences') }}
          </template>
          <template v-if="references && isEmptyValue(references.referencesList)">
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
      </el-menu>
    </right-menu>
  </div>
</template>

<script>
import { contextMixin } from '@/components/ADempiere/ContextMenu/contextMenuMixin'
import RightMenu from '@/components/RightPanel/menu'

export default {
  name: 'ContextMenuMobile',
  components: {
    RightMenu
  },
  mixins: [contextMixin]
}
</script>
