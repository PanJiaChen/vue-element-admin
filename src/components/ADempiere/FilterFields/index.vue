<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <el-form :class="cssClass" style="float: right;">
    <el-form-item>
      <template v-if="!isEmptyValue(groupField)" slot="label">
        {{ groupField }}
      </template>

      <el-select
        v-model="fieldsListShowed"
        :filterable="!isMobile"
        :placeholder="$t('components.filterableItems')"
        multiple
        collapse-tags
        value-key="key"
        :size="size"
        :popper-append-to-body="true"
      >
        <el-option
          v-for="(item, key) in fieldsListAvailable"
          :key="key"
          :label="item.name"
          :value="item.columnName"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'FilterFields',

  props: {
    containerUuid: {
      type: String,
      required: true
    },
    groupField: {
      type: String,
      default: ''
    },
    panelType: {
      type: String,
      default: 'window'
    },
    /**
     * If is used in table, by default false
     */
    inTable: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root }) {
    const isAdvancedQuery = props.panelType === 'table'

    const size = props.inTable
      ? 'mini'
      : 'small'

    const cssClass = props.inTable
      ? 'form-filter-columns'
      : 'form-filter-fields'

    const showedAttibute = props.inTable
      ? 'isShowedTableFromUser'
      : 'isShowedFromUser'

    const isMobile = computed(() => {
      root.$store.state.app.device === 'mobile'
    })

    const fieldsListAvailable = computed(() => {
      if (!props.inTable && props.panelType === 'window' && !root.isEmptyValue(props.groupField)) {
        // compare group fields to window
        return root.$store.getters.getFieldsListNotMandatory({
          containerUuid: props.containerUuid
        })
          .filter(fieldItem => {
            return fieldItem.groupAssigned === props.groupField
          })
      }
      // get fields not mandatory
      return root.$store.getters.getFieldsListNotMandatory({
        containerUuid: props.containerUuid,
        isTable: props.inTable
      })
    })

    // fields showed
    const fieldsListShowed = computed({
      get() {
        return fieldsListAvailable.value.filter(itemField => {
          return itemField[showedAttibute]
        }).map(itemField => {
          return itemField.columnName
        })
      },
      set(selecteds) {
        // set columns to show/hidden in vuex store
        changeShowed(selecteds)
      }
    })

    const changeShowed = (selectedValues) => {
      if (props.inTable) {
        return changeShowedTable(selectedValues)
      }
      return changeShowedPanel(selectedValues)
    }

    /**
     * Set fields to hidden/showed in panel
     * if is advanced query or browser panel with values or null/not null
     * operator, dispatch search
     * @param {array} selectedValues
     */
    const changeShowedPanel = (selectedValues) => {
      root.$store.dispatch('changeFieldShowedFromUser', {
        containerUuid: props.containerUuid,
        fieldsUser: selectedValues,
        show: true,
        groupField: props.groupField,
        isAdvancedQuery
      })
    }

    /**
     * Set columns to hidden/showed in table
     * @param {array} selectedValues
     */
    const changeShowedTable = (selectedValues) => {
      root.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: props.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    }

    return {
      cssClass,
      // computeds
      isMobile,
      size,
      fieldsListShowed,
      fieldsListAvailable,
      // methods
      changeShowed
    }
  }
})
</script>

<style lang="scss" scoped>
.form-filter-fields {
  .el-form-item {
    margin-bottom: 0px !important;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
}

.form-filter-columns {
  margin: 0px;
}
</style>
<style lang="scss">
/*
.form-filter-fields {
  .el-tag--small {
    max-width: 132px !important;
  }

  // text tag
  .el-tag {
    &.el-tag--info {
      &.el-tag--small {
        &.el-tag--light  {
          // max-width: calc(100% - 10px);
          &:first-child {
            .el-select__tags-text {
              max-width: calc(100% - 15px);
            }
          }
        }
      }
    }
  }
  .el-select__tags-text {
    width: 100%;
    overflow: hidden !important;
    white-space: nowrap;
    text-overflow: ellipsis !important; // ... end text
    display: inline-block;
  }

  // icon X close tag
  .el-select i.el-tag__close {
    &.el-tag__close {
      // left: 58%;
      // margin-top: 0px !important;
      // top: 0 !important;
      color: #FFF !important;
      // position: absolute !important;
      position: relative !important;
      top: -7 !important;
    }
  }
}
*/
</style>
