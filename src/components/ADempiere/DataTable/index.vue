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
  <el-container
    v-if="isLoadPanel"
    label-position="top"
    style="height: inherit;"
    class="data-table-component"
  >
    <el-main style="padding: 0px !important; overflow: hidden;">
      <el-container style="height: 100%;">
        <el-header :style="tableHeaderStyle">
          <el-collapse
            v-if="isParent"
            v-model="activeName"
            v-shortkey="shorcutKey"
            @shortkey.native="actionAdvancedQuery()"
          >
            <el-collapse-item :title="$t('table.dataTable.advancedQuery')" name="PanelAdvancedQuery">
              <template v-if="isLoadedPanel">
                <main-panel
                  :container-uuid="'table_' + containerUuid"
                  :parent-uuid="'table_' + parentUuid"
                  :metadata="panelMetadata"
                  panel-type="table"
                  is-advanced-query
                  class="collapse_item_wrap"
                />
              </template>
            </el-collapse-item>
          </el-collapse>

          <div v-if="!isMobile">
            <table-main-menu
              :container-uuid="containerUuid"
              :parent-uuid="parentUuid"
              :panel-type="panelType"
              :is-parent="isParent"
              :is-panel-window="isPanelWindow"
              :process-menu="getMenuTable"
              :is-mobile="isMobile"
              :panel-metadata="panelMetadata"
            />
            <el-button
              v-if="!isParent && isPanelWindow"
              type="text"
              :icon="(newRecordsQuantity <= 0) ? 'el-icon-circle-plus' : 'el-icon-remove'"
              style="float: right; padding-top: 8px; font-size: larger; padding-left: 6px; color: gray;"
              :disabled="newRecordsQuantity <= 0 ? isDisabledAddNew : false"
              @click="(newRecordsQuantity <= 0) ? addNewRow() : callOffNewRecord()"
            />
            <icon-element icon="el-icon-news">
              <fixed-columns
                :container-uuid="containerUuid"
                :panel-type="panelType"
                class="header-search-input"
              />
            </icon-element>

            <filter-fields
              v-if="isShowOptionalColumns"
              :container-uuid="containerUuid"
              :panel-type="panelType"
              :in-table="true"
            />

            <div :class="{ show: showTableSearch }" class="local-search-container">
              <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
              <el-input
                ref="headerSearchInput"
                v-model="searchTable"
                size="mini"
                :placeholder="$t('table.dataTable.search')"
                class="header-search-input"
                @input="filterResult"
              />
            </div>
          </div>
          <!-- <div v-else>
            <div v-if="!isParent">
              <div :class="{ show: showTableSearch }" class="local-search-container">
                <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
                <el-input
                  ref="headerSearchInput"
                  v-model="searchTable"
                  size="mini"
                  :placeholder="$t('table.dataTable.search')"
                  class="header-search-input"
                  clearable
                />
              </div>
            </div>
            <div v-else class="panel-expand">
              <el-button
                v-show="isPanelWindow && getDataSelection.length"
                type="text"
                icon="el-icon-delete"
                style="color: black; font-size: 17px; font-weight: 605 !important;"
                @click="deleteSelection()"
              />
            </div>
          </div>  -->
        </el-header>

        <el-main style="padding: 0px !important; overflow: hidden;">
          <div v-if="isEmptyValue(activeName) && isMobile && isParent" :class="{ show: showTableSearch }" class="local-search-container">
            <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
            <el-input
              ref="headerSearchInput"
              v-model="searchTable"
              size="mini"
              :placeholder="$t('table.dataTable.search')"
              class="header-search-input"
              clearable
            />
          </div>
          <table-context-menu
            v-show="isShowedContextMenu"
            :style="{ left: leftContextualMenu + 'px', top: topContextualMenu + 'px' }"
            class="contextual-menu"
            :container-uuid="containerUuid"
            :parent-uuid="parentUuid"
            :panel-type="panelType"
            :current-row="currentRowMenu"
            :is-panel-window="isPanelWindow"
            :process-menu="getMenuTable"
            :is-mobile="isMobile"
            :panel-metadata="panelMetadata"
          />
          <el-table
            ref="multipleTable"
            v-loading="!isCreateNewRoute && isLoaded"
            :height="getHeigthTable"
            style="width: 100%"
            border
            :row-key="panelMetadata.keyColumn"
            reserve-selection
            highlight-current-row
            :row-style="rowStyle"
            :data="allRecordsData"
            :element-loading-text="$t('notifications.loading')"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            cell-class-name="datatable-max-cell-height"
            :show-summary="isShowedTotals"
            :row-class-name="tableRowClassName"
            :summary-method="getSummaries"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblClick"
            @select="handleSelection"
            @select-all="handleSelectionAll"
            @row-contextmenu="rowMenu"
            @contextmenu.prevent.native="block"
          >
            <el-table-column
              v-if="isTableSelection"
              type="selection"
              :prop="panelMetadata.keyColumn"
              fixed
              min-width="50"
            />
            <template v-for="(fieldAttributes, key) in fieldsList">
              <el-table-column
                v-if="isDisplayedField(fieldAttributes)"
                :key="key"
                :label="headerLabel(fieldAttributes)"
                :column-key="fieldAttributes.columnName"
                :prop="fieldAttributes.columnName"
                sortable
                min-width="200"
                :class-name="cellClass(fieldAttributes)"
                :fixed="fieldAttributes.isFixedTableColumn"
              >
                <template slot-scope="scope">
                  <template v-if="rowCanBeEdited(scope.row, fieldAttributes)">
                    <field-definition
                      :is-data-table="true"
                      :is-show-label="false"
                      :in-table="true"
                      :metadata-field="{
                        ...fieldAttributes,
                        displayColumn: scope.row[fieldAttributes.displayColumnName],
                        tableIndex: scope.$index,
                        rowKey: scope.row[panelMetadata.keyColumn],
                        keyColumn: panelMetadata.keyColumn,
                        recordUuid: scope.row.UUID
                      }"
                      :record-data-fields="scope.row[fieldAttributes.columnName]"
                      size="mini"
                      @keyup.enter.native="confirmEdit(scope.row)"
                    />
                  </template>
                  <template
                    v-else
                  >
                    <el-tag
                      v-if="['DocStatus', 'O_DocStatus'].includes(fieldAttributes.columnName)"
                      :style="getFieldDefinition(fieldAttributes.fieldDefinition, scope.row)"
                      :type="tagStatus(scope.row[fieldAttributes.columnName])"
                      disable-transitions
                    >
                      {{ displayedValue(scope.row, fieldAttributes) }}
                    </el-tag>
                    <span v-else :style="getFieldDefinition(fieldAttributes.fieldDefinition, scope.row)">
                      {{ displayedValue(scope.row, fieldAttributes) }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>

          <custom-pagination
            :total="totalRecords"
            :current-page="pageNumber"
            :selection="getDataSelection.length"
            :handle-change-page="handleChangePage"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script src="./dataTables-Script.js" >
// if you use separate component files like this, the script.js should not
// be named 'index.js' as you would have to specify the '/index.vue' suffix
// on your import for every import where this component is used, otherwise
// you might have problems with the template compiler similar to:
// [Vue warn]: Failed to mount component: template or render function not defined.
</script>

<style lang="scss" src="./dataTables-StyleGlobal.scss">
</style>
<style lang="scss" scoped src="./dataTables-StyleScoped.scss">
</style>
