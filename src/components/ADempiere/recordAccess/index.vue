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
  <div class="board">
    <div
      :key="1"
      class="kanban todo"
      header-text="Todo"
    >
      <div class="board-column">
        <div class="board-column-header">
          {{ $t('data.recordAccess.hideRecord') }} ({{ getterListExclude.length }})
        </div>
        <draggable
          v-model="getterListExclude"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
        >
          <div
            v-for="element in getterListExclude"
            :key="element.UUID"
            class="board-item"
          >
            {{ element.clientName }}
          </div>

        </draggable>
      </div>
    </div>
    <div
      :key="2"
      class="kanban working"
      header-text="Working"
    >
      <div class="board-column">
        <div class="board-column-header">
          {{ $t('data.recordAccess.recordDisplay') }} {{ getterListInclude.length }}
        </div>
        <draggable
          v-model="getterListInclude"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
          @change="handleChange"
        >
          <div
            v-for="element in getterListInclude"
            :key="element.UUID"
            class="board-item"
          >
            {{ element.name }}
            <el-divider direction="vertical" />
            {{ $t('data.recordAccess.isReadonly') }} <el-checkbox v-model="isReadonly" />
            <el-divider direction="vertical" />
            {{ $t('data.recordAccess.isDependentEntities') }} <el-checkbox v-model="isDependentEntities" />
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'RecordAccess',
  components: {
    draggable
  },
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    order: {
      type: String,
      default: undefined
    },
    included: {
      type: String,
      default: undefined
    },
    keyColumn: {
      type: String,
      default: undefined
    },
    identifiersList: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      group: 'sequence',
      isReadonly: false,
      isDependentEntities: true,
      getterDataRecords: this.$store.getters['user/getRoles']
    }
  },
  computed: {
    getterListExclude: {
      get() {
        return this.getterDataRecords.filter(item => item.isPersonalLock === false)
      },
      set(value) {
      }
    },
    getterListInclude: {
      get() {
        return this.getterDataRecords.filter(item => item.isPersonalLock === true)
      },
      set(value) {
      }
    },
    getIdentifiersList() {
      return this.identifiersList
        .filter(item => item.componentPath !== 'FieldSelect')
    }
  },
  created() {
    const record = this.getterDataRecords.map(record => {
      return {
        id: record.id,
        uuid: record.uuid,
        IsExclude: record.isPersonalLock,
        isDependentEntities: this.isDependentEntities,
        isReadonly: this.isReadonly
      }
    })
    this.$store.dispatch('changeList', record)
  },
  methods: {
    handleChange(value) {
      const action = Object.keys(value)[0] // get property
      const element = value.[action].element
      const index = this.getterDataRecords.findIndex(role => role.id === element.id)
      switch (action) {
        case 'added':
          this.addItem({
            index,
            element
          })
          break
        case 'removed':
          this.deleteItem({
            index,
            element
          })
          break
      }
    },
    /**
     * @param {number} index: the index of the added element
     * @param {object} element: the added element
     */
    addItem({
      index,
      element
    }) {
      this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
    },
    /**
     * @param {number} index: the index of the element before remove
     * @param {object} element: the removed element
     */
    deleteItem({
      index,
      element
    }) {
      this.getterDataRecords[index].isPersonalLock = !element.isPersonalLock
      const record = this.getterDataRecords.map(record => {
        return {
          id: record.id,
          uuid: record.uuid,
          IsExclude: record.isPersonalLock,
          isDependentEntities: this.isDependentEntities,
          isReadonly: this.isReadonly
        }
      })
      this.$store.dispatch('changeList', record)
    },
    getOrder(arrayToSort, orderBy = this.order) {
      return arrayToSort.sort((itemA, itemB) => {
        return itemA[orderBy] - itemB[orderBy]
      })
    }
  }
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
  .board {
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
