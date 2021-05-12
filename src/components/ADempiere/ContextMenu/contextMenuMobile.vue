<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <div v-if="!isListRecord" class="container-submenu-mobile container-context-menu">
    <!-- actions or process on container -->
    <el-dropdown
      size="mini"
      :hide-on-click="true"
      split-button
      trigger="click"
      @command="clickRunAction"
      @click="runAction(defaultActionToRun)"
    >
      {{ defaultActionName }}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          command="refreshData"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-refresh" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuRefresh') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          :command="this.$t('data.addNote')"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-notebook-2" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('data.addNote') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.descriptionNote') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          v-for="(action, index) in actions"
          :key="index"
          :command="action"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i :class="iconAction(action)" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ action.name }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item
          command="shareLink"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <i class="el-icon-copy-document" style="font-weight: bolder;" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ $t('components.contextMenuShareLink') }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- menu relations -->
    <el-dropdown size="mini" @command="clickRelation">
      <el-button type="success" plain size="mini">
        {{ $t('components.contextMenuRelations') }} <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(relation, index) in relationsList"
          :key="index"
          :command="relation"
          :divided="true"
        >
          <div class="contents">
            <div style="margin-right: 5%;margin-top: 10%;">
              <svg-icon :icon-class="relation.meta.icon" />
            </div>
            <div>
              <span class="contents">
                <b class="label">
                  {{ relation.meta.title }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ relation.meta.description }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown size="mini" @command="clickReferences">
      <el-button type="warning" plain :disabled="!(isReferecesContent && isLoadedReferences)" size="mini">
        {{ $t('components.contextMenuReferences') }} <i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(reference, index) in references.referencesList"
          :key="index"
          :command="reference"
          :divided="true"
        >
          <div class="contents">
            <div>
              <span class="contents">
                <b class="label">
                  {{ reference.displayName }}
                </b>
              </span>
              <p
                class="description"
              >
                {{ $t('data.noDescription') }}
              </p>
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import contextMixin from './contextMenuMixin.js'

export default {
  name: 'ContextMenuMobile',
  mixins: [
    contextMixin
  ],
  data() {
    return {
      openedsMenu: [
        'actions'
      ]
    }
  },
  computed: {
    isPanelTypeMobile() {
      if (['process', 'report'].includes(this.$route.meta.type)) {
        return true
      }
      return false
    },
    isUndoAction() {
      if (this.isWindow) {
        if (!this.isWithRecord) {
          return true
        }
      }
      return false
    },
    typeOfAction() {
      if (this.isUndoAction) {
        return 'warning'
      }
      return 'default'
    },
    isPlain() {
      if (this.isUndoAction) {
        return true
      }
      return false
    },
    defaultActionToRun() {
      if (this.isUndoAction) {
        return this.actions[2]
      }
      return this.actions[0]
    },
    defaultActionName() {
      if (this.isWindow) {
        if (this.isWithRecord) {
          return this.$t('window.newRecord')
        }
        return this.$t('data.undo')
      }
      return this.$t('components.RunProcess')
    },
    iconDefault() {
      if (this.isPanelTypeMobile) {
        return 'component'
      }
      return 'skill'
    }
  },
  created() {
    this.generateContextMenu()
    this.getReferences()
  },
  methods: {
    clickRelation(item) {
      this.$router.push({
        name: item.name,
        query: {
          tabParent: 0
        }
      }, () => {})
    },
    clickRunAction(action) {
      if (action === 'refreshData') {
        this.refreshData()
      } else if (action === 'shareLink') {
        this.setShareLink()
      } else if (action.action === 'recordAccess') {
        this.$store.commit('changeShowRigthPanel', false)
        this.$store.commit('setRecordAccess', true)
      } else if (action === this.$t('data.addNote')) {
        this.$store.commit('changeShowRigthPanel', true)
        this.$store.dispatch('setOptionField', {
          name: this.$t('data.addNote')
        })
      } else {
        this.runAction(action)
      }
    },
    clickReferences(reference) {
      this.openReference(reference)
    },
    iconAction(action) {
      let icon
      if (action.type === 'dataAction') {
        switch (action.action) {
          case 'setDefaultValues':
            icon = 'el-icon-news'
            break
          case 'deleteEntity':
            icon = 'el-icon-delete'
            break
          case 'undoModifyData':
            icon = 'el-icon-refresh-left'
            break
          case 'lockRecord':
            icon = 'el-icon-lock'
            break
          case 'unlockRecord':
            icon = 'el-icon-unlock'
            break
          case 'recordAccess':
            icon = 'el-icon-c-scale-to-original'
            break
        }
      } else if (action.type === 'process') {
        icon = 'el-icon-setting'
      } else {
        icon = 'el-icon-setting'
      }
      return icon
    },
    styleLabelAction(value) {
      if (value) {
        return 'font-size: 14px;margin-top: 0% !important;margin-left: 0px;margin-bottom: 10%;display: contents;'
      } else {
        return 'font-size: 14px;margin-top: 1.5% !important;margin-left: 2%;margin-bottom: 5%;display: contents;'
      }
    }
  }
}
</script>
<style>
  .el-button-group > .el-button:not(:last-child) {
    margin-right: -1px;
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .el-button-group > .el-button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-right: -1px;
    color: #409eff;
    background: #c3defd;
    border-color: #1682e6;
  }
</style>
<style scoped>
  .el-tree-node__children {
    overflow: hidden;
    background-color: transparent;
    max-width: 99%;
    overflow: auto;
  }
  .el-dropdown .el-button-group {
    display: flex;
  }
  .el-dropdown-menu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    padding: 10px 0;
    margin: 5px 0;
    background-color: #FFFFFF;
    border: 1px solid #e6ebf5;
    border-radius: 4px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    max-height: 250px;
    max-width: 220px;
    overflow: auto;
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    line-height: 14px;
    padding: 0px 15px;
    font-size: 10px;
  }
  .el-dropdown-menu__item--divided {
    position: relative;
    /* margin-top: 6px; */
    border-top: 1px solid #e6ebf5;
  }
  .svg-icon {
    width: 1em;
    height: 2em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
  .label {
    font-size: 14px;
    margin-top: 0% !important;
    margin-left: 0px;
    text-align: initial;
  }
  .description {
    margin: 0px;
    font-size: 12px;
    text-align: initial;
  }
  .contents {
    display: inline-flex;
  }
</style>
