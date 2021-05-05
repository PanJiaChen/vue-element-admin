<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
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
  <div>
    <div class="board">
      <div
        :key="1"
        class="kanban todo"
        header-text="Todo"
        style="padding: 0px;margin: 0px;width: 35%;padding-right: 2%;"
      >
        <div class="board-column">
          <div class="board-column-header">
            {{ $t('data.recordAccess.availableRoles') }} ({{ excludedList.length }})
          </div>
          <draggable
            v-model="excludedList"
            :group="group"
            v-bind="$attrs"
            class="board-column-content"
          >
            <div
              v-for="(element, index) in excludedList"
              :key="element.roleUuid"
              class="board-item"
              style="height: 50%;padding-left: 0px;padding-right: 0px;min-width: 250px;max-width: 100%;"
            >
              <el-table
                v-if="!isEmptyValue(excludedList)"
                :data="[excludedList[index]]"
                border
                :show-header="false"
                style="min-width: 100%;padding-left: 0%;padding-right: 0%;"
              >
                <el-table-column>
                  <template slot-scope="scope">
                    <b style="white-space: normal;">
                      {{
                        scope.row.roleName
                      }}
                    </b>
                  </template>
                </el-table-column>
              </el-table>
            </div>

          </draggable>
        </div>
      </div>
      <div
        :key="2"
        class="kanban working"
        header-text="Working"
        style="padding: 0px;margin: 0px;width: 65%;padding-right: 1.5%;"
      >
        <div class="board-column">
          <div class="board-column-header">
            {{ $t('data.recordAccess.configRoles') }} ({{ includedList.length }})
          </div>
          <draggable
            v-model="includedList"
            :group="group"
            v-bind="$attrs"
            class="board-column-content"
            @change="handleChange"
          >
            <div
              v-for="(element, index) in includedList"
              :key="element.roleUuid"
              class="board-item"
              style="height: 50%;padding-left: 0px;padding-right: 0px;min-width: 400px;max-width: 100%;"
            >
              <el-table
                v-if="!isEmptyValue(includedList)"
                :data="[includedList[index]]"
                border
                :show-header="false"
                style="padding-left: 0%;padding-right: 0%;"
              >
                <el-table-column>
                  <template slot-scope="scope">
                    <b style="white-space: normal;">
                      {{
                        scope.row.roleName
                      }}
                    </b>
                  </template>
                </el-table-column>
                <el-table-column min-width="100">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isExclude"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :inactive-text="$t('data.recordAccess.isLock')"
                      :active-text="$t('data.recordAccess.isUnlock')"
                    />
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <div v-if="scope.row.isExclude">
                      <el-switch
                        v-model="scope.row.isReadOnly"
                        :inactive-text="$t('data.recordAccess.isReadonly')"
                        active-text="Editable"
                      />
                    </div>
                    <div v-else>
                      <b>
                        {{ $t('data.recordAccess.isDependentEntities') }}
                      </b>
                      <el-switch v-model="scope.row.isDependentEntities" />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </draggable>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer" style="float: right;padding-top: 1%;">
      <el-button
        type="danger"
        icon="el-icon-close"
        @click="close"
      />
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="saveRecordAccess(includedList)"
      />
    </span>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import recordAccessMixin from './recordAccess.js'
export default {
  name: 'RecordAccessDesktop',
  components: {
    draggable
  },
  mixins: [recordAccessMixin]
}
</script>

<style lang="scss" scoped>
  .board-column {
    min-width: 250px;
    min-height: 70px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;
    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }
    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      .board-item {
        cursor: pointer;
        width: 100%;
        height: 30px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 30px;
        padding: 0px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
<style lang="scss">
  .el-table .warning-row {
    border: solid;
    border-color: red;
    background: white;
  }

  .el-table .success-row {
    background: white;
    border: solid;
    border-color: #11b95c42;
  }
  .board-column .board-column-content[data-v-67e5b2d0] {
    max-height: 55vh;
    height: auto;
    overflow: auto;
    border: 10px solid transparent;
    min-height: 60px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .board {
    height: 90%;
    width: 100%;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.working {
      .board-column-header {
        background: #4A9FF9;
      }
    }
  }
</style>
