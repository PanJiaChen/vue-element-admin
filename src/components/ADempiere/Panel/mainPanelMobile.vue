<template>
  <div class="wrapper">
    <el-form
      v-if="isLoadPanel"
      key="panel-loaded"
      v-model="dataRecords"
      label-position="top"
      label-width="200px"
    >
      <template
        v-if="firstGroup && firstGroup.groupFinal === ''"
      >
        <div v-show="firstGroup.activeFields" class="cards-not-group">
          <div
            v-if="(groupTab.groupType == 'T' && groupTab.groupName == firstGroup.groupFinal)
              || (groupTab.groupType !== 'T' && firstGroup.typeGroup !== 'T')"
            class="card"
          >
            <div class="select-filter">
              <span>
                {{ firstGroup.groupFinal }}
              </span>
              <filter-fields
                :container-uuid="containerUuid"
                :panel-type="panelType"
                :group-field="firstGroup.groupFinal"
                :is-advanced-query="isAdvancedQuery"
              />
            </div>
            <el-card
              :shadow="shadowGroup"
              :body-style="{ padding: '10px' }"
            >
              <el-row>
                <template v-for="(fieldAttributes, subKey) in firstGroup.metadataFields">
                  <field-definition
                    :ref="fieldAttributes.columnName"
                    :key="subKey"
                    :metadata-field="{
                      ...fieldAttributes,
                      ...panelAttributes
                    }"
                    :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                    :in-group="!isShowedRecordNavigation"
                    :is-advanced-query="isAdvancedQuery"
                  />
                </template>
              </el-row>
            </el-card>
          </div>
        </div>
      </template>
      <div :class="classCards">
        <template v-for="(item, key) in fieldGroups">
          <el-row :key="key">
            <el-col :key="key" :span="24">
              <div
                v-if="item.groupFinal !== ''
                  && (groupTab.groupType == 'T' && groupTab.groupName == item.groupFinal)
                  || (groupTab.groupType !== 'T' && item.typeGroup !== 'T')"
                :key="key"
                class="card"
              >
                <el-card
                  :shadow="shadowGroup"
                  :body-style="{ padding: '10px' }"
                >
                  <div slot="header" class="clearfix">
                    <span>
                      {{ item.groupFinal }}
                    </span>
                    <div v-if="!isAdvancedQuery" class="select-filter-header">
                      <filter-fields
                        :container-uuid="containerUuid"
                        :panel-type="panelType"
                        :group-field="item.groupFinal"
                        :is-first-group="false"
                      />
                    </div>
                  </div>
                  <el-row>
                    <template v-for="(fieldAttributes, subKey) in item.metadataFields">
                      <field-definition
                        :ref="fieldAttributes.columnName"
                        :key="subKey"
                        :metadata-field="{
                          ...fieldAttributes,
                          ...panelAttributes
                        }"
                        :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                        :in-group="isPanelWindow && fieldGroups.length > 1"
                      />
                    </template>
                  </el-row>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form>
    <div
      v-else
      key="panel-loading"
      v-loading="!isLoadPanel"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import { mainPanelMixin } from '@/components/ADempiere/Panel/mainPanelMixin'

export default {
  name: 'MainPanelMobile',
  mixins: [mainPanelMixin]
}
</script>

<style scoped>
  .loading-panel {
    padding: 100px;
    height: 100%;
  }

  .cards-in-group {
    column-count: 2;  /*numbers of columns */
    column-gap: 1em;
  }
  .cards-not-group {
    column-count: 1; /* numbers of columns */
    column-gap: 1em;
    margin-bottom: 5px;
  }

  .card {
    /* padding: 10px; */
    width: 100% !important;
    transition: all 100ms ease-in-out;
    display: inline-block;
    perspective: 1000;
    backface-visibility: hidden;
  }
  .el-card {
    width: 100% !important;
  }
</style>
