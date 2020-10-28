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
        <draggable
          key="draggable-loaded"
          :list="fieldGroups"
          v-bind="$attrs"
          :set-data="setData"
        >
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
                      <div class="select-filter-header">
                        <filter-fields
                          :container-uuid="containerUuid"
                          :panel-type="panelType"
                          :group-field="item.groupFinal"
                          :is-first-group="false"
                          :is-advanced-query="isAdvancedQuery"
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
                          :is-advanced-query="isAdvancedQuery"
                        />
                      </template>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </template>
        </draggable>
      </div>
    </el-form>
    <div
      v-else
      key="panel-loading"
      v-loading="!isLoadPanel"
      :element-loading-text="$t('notifications.loading')"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import mainPanelMixin from './mainPanelMixin.js'
import draggable from 'vuedraggable'

export default {
  name: 'MainPanelDesktop',
  components: {
    draggable
  },
  mixins: [mainPanelMixin],
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    }
  }
}
</script>

<style scoped src="./index.css">
</style>
