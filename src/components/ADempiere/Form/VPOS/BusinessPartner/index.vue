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
  <el-form-item>
    <template slot="label">
      {{ $t('form.pos.order.BusinessPartnerCreate.businessPartner') }}
      <el-popover
        v-model="showCreate"
        placement="right"
        width="400"
        trigger="click"
        @hide="popoverClose"
      >
        <business-partner-create
          :parent-metadata="parentMetadata"
          :show-field="showCreate"
        />
        <el-button
          slot="reference"
          type="text"
          :disabled="isDisabled"
          @click="popoverOpen"
        >
          <i
            class="el-icon-circle-plus"
          />
        </el-button>
      </el-popover>
      <el-popover
        placement="right"
        width="800"
        trigger="click"
        :disabled="isDisabled"
        @hide="showFieldList = !showFieldList"
      >
        <business-partners-list
          :parent-metadata="parentMetadata"
          :shows-popovers="showsPopovers"
          :show-field="showFieldList"
        />
        <el-button
          slot="reference"
          type="text"
          @click="showFieldList = !showFieldList"
        >
          <i
            class="el-icon-search"
          />
        </el-button>
      </el-popover>
    </template>
    <el-autocomplete
      v-model="displayedValue"
      :placeholder="$t('quickAccess.searchWithEnter')"
      :fetch-suggestions="localSearch"
      clearable
      value-key="name"
      style="width: 100%;"
      popper-class="custom-field-bpartner-info"
      :disabled="isDisabled"
      @clear="setBusinessPartner(blankBPartner, false)"
      @keyup.enter.native="getBPartnerWithEnter"
      @select="handleSelect"
      @focus="setNewDisplayedValue"
      @blur="setOldDisplayedValue"
    >
      <template
        slot="prefix"
      >
        <i
          class="el-icon-user-solid el-input__icon"
        />
      </template>

      <template slot-scope="props">
        <div class="header">
          <b>{{ props.item.name }} </b>
        </div>
        <span class="info">
          {{ props.item.value }}
        </span>
      </template>
    </el-autocomplete>
  </el-form-item>
</template>

<script>
/**
 * This component is made to be the prototype of the Business Partner search field
 * TODO: Before creating you must make a search for all the filled fields.
 */
import { requestGetBusinessPartner } from '@/api/ADempiere/system-core.js'
import BusinessPartnerCreate from './businessPartnerCreate'
// import FieldListBusinessPartner from './fieldBusinessPartners/index'
import BusinessPartnersList from './businessPartnersList'
import BParterMixin from './mixinBusinessPartner.js'
const { setBusinessPartner } = BParterMixin.methods
const { searchBPartnerList } = BusinessPartnersList.methods
import { trimPercentage } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'FieldBusinessPartner',
  components: {
    BusinessPartnerCreate,
    BusinessPartnersList
    // FieldListBusinessPartner
  },
  props: {
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    showsPopovers: {
      type: Object,
      default: () => {
        return {
          isShowCreate: false,
          isShowList: false
        }
      }
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      controlDisplayed: this.displayedValue,
      timeOut: null,
      showFieldCreate: false,
      showFieldList: false,
      showCreate: false
    }
  },
  computed: {
    value: {
      get() {
        return this.$store.getters.getValueOfField({
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.parentMetadata.containerUuid,
          columnName: 'C_BPartner_ID', // this.parentMetadata.columnName,
          value
        })
      }
    },
    displayedValue: {
      get() {
        return this.$store.getters.getValueOfField({
          containerUuid: this.parentMetadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: 'DisplayColumn_C_BPartner_ID' // this.parentMetadata.displayColumnName
        })
      },
      set(value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.parentMetadata.containerUuid,
          // DisplayColumn_'ColumnName'
          columnName: 'DisplayColumn_C_BPartner_ID', // this.parentMetadata.displayColumnName,
          value
        })
      }
    },
    recordsBusinessPartners() {
      return this.$store.getters.getBusinessPartnersList
    },
    blankBPartner() {
      return {
        uuid: undefined,
        id: undefined,
        name: undefined
      }
    },
    popoverCreateBusinessParnet() {
      return this.$store.getters.getPopoverCreateBusinessParnet
    }
  },
  watch: {
    popoverCreateBusinessParnet(value) {
      this.showCreate = value
    }
  },
  methods: {
    setBusinessPartner,
    searchBPartnerList,
    setNewDisplayedValue() {
      const displayValue = this.displayedValue
      if (this.controlDisplayed !== displayValue) {
        this.controlDisplayed = displayValue
      }
    },
    setOldDisplayedValue() {
      if (this.controlDisplayed !== this.displayedValue) {
        this.displayedValue = this.controlDisplayed
      }
    },
    localSearch(stringToMatch, callBack) {
      if (this.isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      const recordsList = this.recordsBusinessPartners
      let results = recordsList
      if (stringToMatch) {
        const parsedValue = trimPercentage(stringToMatch.toLowerCase().trim())

        results = recordsList.filter(rowBPartner => {
          for (const columnBPartner in rowBPartner) {
            const valueToCompare = String(rowBPartner[columnBPartner]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (this.isEmptyValue(results) && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)

          this.timeOut = setTimeout(() => {
            this.remoteSearch(stringToMatch)
              .then(remoteResponse => {
                callBack(remoteResponse)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    },
    remoteSearch(searchValue) {
      return new Promise(resolve => {
        const message = {
          message: 'Sin resultados coincidentes con la busqueda',
          type: 'info',
          showClose: true
        }

        this.$store.dispatch('listBPartnerFromServer', {
          pageNumber: 1,
          searchValue
        })
          .then(() => {
            const recordsList = this.recordsBusinessPartners

            if (this.isEmptyValue(recordsList)) {
              this.$message(message)
            }

            resolve(recordsList)
          })
          .catch(error => {
            console.warn(error.message)

            this.$message(message)
            resolve([])
          })
      })
    },
    handleSelect(selectedValue) {
      let businessPartner = selectedValue
      if (this.isEmptyValue(businessPartner)) {
        businessPartner = this.blankBPartner
      }

      this.setBusinessPartner(businessPartner, false)
    },
    onClose() {
      this.showsPopovers.isShowCreate = true
    },
    // TODO: Improve the handling of the event, if given an option to not search
    getBPartnerWithEnter(event) {
      const value = String(event.target.value).trim()

      // Get one element
      // this.getBPartner(value)

      const createBP = () => {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Name',
          value
        })
        this.$store.commit('updateValueOfField', {
          containerUuid: 'Business-Partner-Create',
          columnName: 'Value',
          value
        })

        this.showsPopovers.isShowList = false
        this.showsPopovers.isShowCreate = true
      }

      this.searchBPartnerList({
        searchValue: `%${value}%`
      }, false)
        .then(responseBPartnerList => {
          const records = responseBPartnerList.length

          if (records <= 0) {
            // open create (without records)
            createBP()
            this.controlDisplayed = ''
          } else if (records === 1) {
            // set unique match
            this.setBusinessPartner(responseBPartnerList[0], false)
            this.controlDisplayed = responseBPartnerList[0].name
          } else {
            // show list with macth's
            const columnName = 'Name' // Value
            // if (Number.isNaN(Number(value))) {
            //   columnName = 'Name'
            // }
            this.$store.commit('updateValuesOfContainer', {
              containerUuid: 'Business-Partner-List',
              attributes: [{
                columnName,
                value: `%${value}%`
              }]
            })

            this.showsPopovers.isShowList = true
            this.showsPopovers.isShowCreate = false
          }
        })
        .catch(error => {
          // create bpartner with typing values
          createBP()
          console.warn(error)
        })
    },
    getBPartner(value) {
      if (this.isEmptyValue(value)) {
        this.$message({
          type: 'warning',
          message: this.$t('notifications.fieldCannotBeEmpty'),
          duration: 1500,
          showClose: true
        })
        return
      }

      requestGetBusinessPartner({
        searchValue: value
      })
        .then(responseBPartner => {
          // set id, uuid and name
          this.setBusinessPartner(responseBPartner, false)
        })
        .catch(error => {
          const message = this.$t('businessPartner.notFound') + ' ' + this.$t('data.createNewRecord')
          this.$message({
            type: 'info',
            message,
            duration: 1500,
            // showClose: true, // TODO: does not activate callback to display create form if closed with click
            onClose: this.onClose
          })

          this.setBusinessPartner({
            ...this.blankBPartner,
            name: value
          })

          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Name',
            value
          })
          this.$store.commit('updateValueOfField', {
            containerUuid: 'Business-Partner-Create',
            columnName: 'Value',
            value
          })
          console.info(`Error get Business Partner. Message: ${error.message}, code ${error.code}.`)
        })
    },
    popoverOpen(value) {
      this.$store.dispatch('changePopover', true)
    },
    popoverClose(value) {
      this.$store.commit('setShowedLocation', false)
    }
  }
}
</script>

<style lang="scss" scope>
  .custom-field-bpartner-info {
    li {
      line-height: normal;
      padding: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .info {
        color: #7e7e7e;
        float: left;
        font-size: 12px;
      }
    }
  }
</style>
