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
  <el-select
    v-model="fieldsListShowed"
    :filterable="!isMobile"
    :placeholder="$t('components.filterableItems')"
    multiple
    size="mini"
    collapse-tags
    value-key="key"
    class="select"
  >
    <el-option
      v-for="(item, key) in fieldsListAvailable"
      :key="key"
      :label="item.name"
      :value="item.columnName"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FilterColumns',
  props: {
    containerUuid: {
      type: String,
      required: true
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    fieldsList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    // available fields
    fieldsListAvailable() {
      return this.fieldsList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        return fieldItem.isActive && isDisplayed && !fieldItem.isKey
      })
    },
    fieldsListShowed: {
      get() {
        // columns showed
        return this.fieldsList.filter(itemField => {
          if (itemField.isShowedTableFromUser && (itemField.isDisplayed || itemField.isDisplayedFromLogic) && !itemField.isKey) {
            return true
          }
        }).map(itemField => {
          return itemField.columnName
        })
      },
      set(selecteds) {
        // set columns to show/hidden in vuex store
        this.addField(selecteds)
      }
    }
  },
  methods: {
    /**
     * Set columns to hidden/showed in table
     * @param {array} selectedValues
     */
    addField(selectedValues) {
      this.$store.dispatch('changeFieldAttributesBoolean', {
        containerUuid: this.containerUuid,
        fieldsIncludes: selectedValues,
        attribute: 'isShowedTableFromUser',
        valueAttribute: true
      })
    }
  }
}
</script>
