<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
  <el-container
    v-if="isLoaded"
    key="form-loaded"
    :class="showNavar ? 'view-base' : 'show-header-view-base'"
    style="height: 84vh;"
  >
    <el-header
      v-if="showContextMenu"
      style="height: 39px; background: white;"
    >
      <modal-dialog
        :parent-uuid="$route.meta.parentUuid"
        :container-uuid="formUuid"
        :panel-type="panelType"
      />
      <context-menu
        :menu-parent-uuid="$route.meta.parentUuid"
        :container-uuid="formUuid"
        :panel-type="panelType"
      />
    </el-header>
    <el-main style="padding-right: 0px !important; padding-bottom: 0px !important;padding-top: 0px !important;padding-left: 0px !important;">
      <el-row>
        <el-col :span="24">
          <el-card
            class="content-collapse"
            :style="isEmptyValue(formMetadata.fieldsList) ? 'height: 100% !important;' : ''"
          >
            <h3 v-if="isShowTitleForm" class="warn-content text-center">
              <el-popover
                v-if="!isEmptyValue(formMetadata.help)"
                ref="helpTitle"
                placement="top-start"
                :title="formTitle"
                width="400"
                trigger="hover"
              >
                <div v-html="formMetadata.help" />
              </el-popover>
              <el-button
                v-popover:helpTitle
                type="text"
                class="title text-center"
              >
                {{ formTitle }}
              </el-button>
              <el-button
                v-if="isShowTitleForm"
                type="text"
                style="float: right"
                :circle="true"
                icon="el-icon-arrow-up"
                @click="changeDisplatedTitle"
              />
            </h3>
            <el-button
              v-if="!isShowTitleForm"
              type="text"
              style="position: absolute; right: 10px;"
              :circle="true"
              icon="el-icon-arrow-down"
              @click="changeDisplatedTitle"
            />
            <form-panel
              :metadata="{
                ...formMetadata,
                fileName: fromFileName,
                title: formTitle
              }"
            />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import ContextMenu from '@/components/ADempiere/ContextMenu'
import FormPanel from '@/components/ADempiere/Form'
import ModalDialog from '@/components/ADempiere/Dialog'

export default {
  name: 'FormView',
  components: {
    ContextMenu,
    FormPanel,
    ModalDialog
  },
  data() {
    return {
      formUuid: this.$route.meta.uuid,
      formMetadata: {},
      isLoaded: false,
      panelType: 'form'
    }
  },
  computed: {
    formTitle() {
      if (this.$route.meta.title === 'PriceChecking') {
        return this.$t('route.PriceChecking')
      } else if (this.$route.meta.title === 'ProductInfo') {
        return this.$t('route.ProductInfo')
      }
      return this.formMetadata.name || this.$route.meta.title
    },
    fromFileName() {
      return this.formMetadata.fileName || this.$route.meta.title
    },
    getterForm() {
      return this.$store.getters.getForm(this.formUuid)
    },
    showContextMenu: {
      get() {
        return this.$store.state.settings.showContextMenu
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showContextMenu',
          value: val
        })
      }
    },
    showNavar() {
      return this.$store.state.settings.showNavar
    },
    isShowTitleForm() {
      return this.$store.getters.getIsShowTitleForm
    }
  },
  created() {
    this.getForm()
  },
  methods: {
    changeDisplatedTitle() {
      this.$store.commit('changeShowTitleForm', !this.isShowTitleForm)
    },
    getForm() {
      const panel = this.getterForm
      if (panel) {
        this.formMetadata = panel
        this.isLoaded = true
      } else {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.formUuid,
          panelType: this.panelType,
          routeToDelete: this.$route
        })
          .then(responseForm => {
            this.formMetadata = responseForm
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    }
  }
}
</script>

<style>
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px !important;
    padding-bottom: 2px !important;
    padding-left: 0px !important;
    height: 100%!important;
  }
</style>
<style scoped >
  .el-row {
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%!important;
  }
  .el-col-24 {
    width: 100%;
    height: 100%!important;
  }
  .view-base {
    height: 100%;
    min-height: calc(100vh - 84px);
    overflow: hidden;
  }
  .show-header-view-base {
    height: 100%;
    min-height: calc(100vh - 26px);
    overflow: hidden;
  }
  .view-loading {
    padding: 100px 100px;
    height: 100%;
  }

  .title, .custom-title {
    color: #000;
    text-size-adjust: 20px;
    font-size: 100%;
    font-weight: 605 !important;
    /* left: 50%; */
  }

  .w-33 {
    width: 100%;
    background-color: transparent;
  }

  .warn-content {
    margin: 0px 0px !important;
    padding-top: 0px !important;
  }
  .content-help {
    width: 100%;
    height: 200%;
    padding-left: 39px !important;
  }
  .el-card {
    width: 100% !important;
    height: 100% !important;
  }
  .content-collapse {
    padding-left: 20 px !important;
    padding-top: 50 px !important;
  }

  .center{
    text-align: center;
  }
</style>
