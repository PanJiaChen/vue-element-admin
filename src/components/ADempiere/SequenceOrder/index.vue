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
  <div class="board">
    <div
      :key="1"
      class="kanban todo"
      header-text="Todo"
    >
      <div class="board-column">
        <div class="board-column-header">
          {{ this.$t('sequence.available') }} ({{ getterListAvaliable.length }})
        </div>
        <draggable
          v-model="getterListAvaliable"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
        >
          <div
            v-for="element in getterListAvaliable"
            :key="element.UUID"
            class="board-item"
          >
            {{ displayedName(element) }}
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
          {{ this.$t('sequence.sequence') }}  ({{ getterListSequence.length }})
        </div>
        <draggable
          v-model="getterListSequence"
          :group="group"
          v-bind="$attrs"
          class="board-column-content"
          @change="handleChange"
        >
          <div
            v-for="element in getterListSequence"
            :key="element.UUID"
            class="board-item"
          >
            {{ displayedName(element) }}
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'SequenceOrder',
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
      required: true
    },
    order: {
      type: String,
      required: true
    },
    included: {
      type: String,
      required: true
    },
    keyColumn: {
      type: String,
      default: undefined
    },
    identifiersList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      group: 'sequence'
    }
  },
  computed: {
    getterDataRecords() {
      return this.$store.getters.getTabSequenceRecord
    },
    getterListAvaliable: {
      get() {
        return this.getterDataRecords.filter(item => {
          return !item[this.included]
        })
      },
      set(value) {
      }
    },
    getterListSequence: {
      get() {
        return this.getterDataRecords.filter(item => {
          return item[this.included]
        })
      },
      set(value) {
      }
    },
    getIdentifiersList() {
      return this.identifiersList
        .filter(item => item.componentPath !== 'FieldSelect')
    }
  },
  methods: {
    displayedName(row) {
      const identifiersList = this.getIdentifiersList.map(item => row[item.columnName]).join('_')
      if (!this.isEmptyValue(identifiersList)) {
        return identifiersList
      }
      return `< ${row[this.keyColumn]} >`
    },
    /**
     * @link https://github.com/SortableJS/Vue.Draggable#events
     */
    handleChange(value) {
      const action = Object.keys(value)[0] // get property
      switch (action) {
        case 'added':
          this.addItem(value[action])
          break
        case 'moved':
          this.movedItem(value[action])
          break
        case 'removed':
          this.deleteItem(value[action])
          break
      }
    },
    /**
     * @param {number} newIndex: the index of the added element
     * @param {object} element: the added element
     */
    addItem({ element, newIndex }) {
      const newSequence = (newIndex + 1) * 10
      element[this.included] = !element[this.included]
      element[this.order] = newSequence
      const dataSequence = this.getterDataRecords.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          return element
        }
        if (newSequence <= itemSequence[this.order]) {
          itemSequence[this.order] = itemSequence[this.order] + 10
        }
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
    },
    /**
     * @param {number} newIndex: the current index of the moved element
     * @param {number} oldIndex: the old index of the moved element
     * @param {object} element: the moved element
     */
    movedItem({ newIndex, oldIndex, element }) {
      let indexEnabledSequence = 0
      const dataSequence = this.getterDataRecords.map(itemSequence => {
        if (!itemSequence[this.included]) {
          itemSequence[this.order] = 0
          return itemSequence
        }
        if (newIndex > oldIndex) {
          // moved to down
          if (itemSequence.UUID === element.UUID) {
            itemSequence[this.order] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence >= oldIndex && indexEnabledSequence < newIndex) {
            itemSequence[this.order] = (indexEnabledSequence + 1) * 10
          }
        } else {
          // moved to up
          if (itemSequence.UUID === element.UUID) {
            itemSequence[this.order] = (newIndex + 1) * 10
            return itemSequence
          }
          if (indexEnabledSequence < oldIndex && indexEnabledSequence >= newIndex) {
            itemSequence[this.order] += 10
          }
        }
        indexEnabledSequence++
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
    },
    /**
     * @param {number} oldIndex: the index of the element before remove
     * @param {object} element: the removed element
     */
    deleteItem({ element, oldIndex }) {
      const oldSequence = element[this.order] // (oldIndex + 1) * 10
      const dataSequence = this.getterDataRecords.map(itemSequence => {
        if (itemSequence.UUID === element.UUID) {
          itemSequence[this.included] = !itemSequence[this.included]
          itemSequence[this.order] = 0
          return itemSequence
        }
        if (itemSequence[this.order] > oldSequence && itemSequence[this.order] > 0) {
          itemSequence[this.order] = itemSequence[this.order] - 10
        }
        return itemSequence
      })

      this.$store.dispatch('setTabSequenceRecord', this.getOrder(dataSequence))
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
