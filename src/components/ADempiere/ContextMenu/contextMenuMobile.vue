<template>
  <div class="container-submenu-mobile container-context-menu">
    <right-menu>
      <el-menu :default-active="activeMenu" :router="false" class="el-menu-demo" mode="vertical" menu-trigger="hover" unique-opened style="width: 258px; float: right;">
        <el-submenu index="1">
          <template slot="title">
            <svg-icon icon-class="tree" /> {{ $t('components.contextMenuRelations') }}
          </template>
          <el-menu-item-group>
            <el-scrollbar wrap-class="scroll">
              <item v-for="(relation, index) in relations" :key="index" :item="relation" />
            </el-scrollbar>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <svg-icon icon-class="link" />{{ $t('components.contextMenuActions') }}
          </template>
          <el-menu-item-group>
            <el-scrollbar wrap-class="scroll">
              <template v-for="(action, index) in actions">
                <el-submenu v-if="action.childs" :key="index" :index="action.name" :disabled="action.disabled">
                  <template slot="title">
                    {{ action.name }}
                  </template>
                  <el-menu-item v-for="(child, key) in action.childs" :key="key" :index="child.uuid" @click="runAction(child)">
                    {{ child.name }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :key="index" :index="action.name" :disabled="action.disabled" @click="runAction(action)">
                  <svg-icon v-if="action.type === 'process'" icon-class="component" /> {{ action.name }}
                </el-menu-item>
              </template>
              <el-menu-item v-show="isReport" index="4">
                <a :href="downloads" :download="file">
                  {{ $t('components.contextMenuDownload') }}
                </a>
              </el-menu-item>
              <el-menu-item index="5" @click="setShareLink">
                {{ $t('components.contextMenuShareLink') }}
              </el-menu-item>
              <el-menu-item index="6" @click="refreshData">
                {{ $t('components.contextMenuRefresh') }}
              </el-menu-item>
            </el-scrollbar>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu :disabled="!isReferecesContent && !isReferencesLoaded" class="el-menu-item" index="3">
          <template slot="title">
            {{ $t('components.contextMenuReferences') }}
          </template>
          <template v-if="references && references.referencesList">
            <template v-for="(reference, index) in references.referencesList">
              <el-menu-item :key="index" :index="reference.displayName" @click="runAction(reference)">
                {{ reference.displayName }}
              </el-menu-item>
            </template>
          </template>
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
