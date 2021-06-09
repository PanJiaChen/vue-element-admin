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
  <el-cascader
    :ref="metadata.columnName"
    :v-model="[value]"
    :placeholder="metadata.placeholder"
    :options="options"
    :readonly="Boolean(metadata.readonly)"
    :disabled="isDisabled"
    :clearable="true"
    filterable
    lazy
    :show-all-levels="false"
    :lazy-load="searchLocatorByWarehouse"
    :props="props"
    @change="preHandleChange"
  />
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { getLocatorList } from '@/api/ADempiere/field/locator.js'

export default {
  name: 'FieldLocation',
  mixins: [
    fieldMixin
  ],
  data() {
    return {
      options: [],
      level: 0,
      props: {
        // checkStrictly: true,
        // emitPath: false,
        lazy: true,
        lazyLoad: this.searchLocatorByWarehouse
      }
    }
  },
  computed: {
    warehouse() {
      return this.$store.getters['user/getWarehouse']
    },
    warehousesList() {
      return this.$store.getters['user/getWarehouses']
        .map(itemWarehouse => {
          return {
            label: itemWarehouse.name,
            value: itemWarehouse.id,
            children: []
          }
        })
    }
  },
  created() {
    this.options = this.warehousesList
  },
  methods: {
    preHandleChange(value) {
      let selected = value
      if (Array.isArray(value)) {
        selected = value[value.length - 1]
      }
      this.handleFieldChange({
        value: selected
      })
      this.value = value
    },
    searchLocatorByWarehouse(node, resolve) {
      getLocatorList({
        warehouseId: node.value
      })
        .then(locators => {
          const locatorList = []
          locators.map(locator => {
            locatorList.push({
              value: locator.id,
              label: locator.value,
              warehouse: locator.warehouseId,
              leaf: true
            })
          })
          //  Resolve this
          resolve(locatorList)
        })
        .catch(error => {
          console.warn(`Error getting Locator List By Warehouse from server. Code: ${error.code}. Message: ${error.message}.`)
          resolve()
        })
    }
  }
}
</script>
