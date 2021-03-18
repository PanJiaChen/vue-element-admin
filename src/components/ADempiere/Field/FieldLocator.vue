<template>
  <el-cascader
    :ref="metadata.columnName"
    :v-model="[value]"
    :placeholder="metadata.help"
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
