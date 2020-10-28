<template>
  <div class="wrapper">
    <el-form
      v-shortkey="{ closeForm: ['esc'] }"
      label-position="top"
      size="small"
      class="location-address"
      @shortkey.native="keyAction"
    >
      <el-row :gutter="24">
        <template v-if="isLoaded">
          <field
            v-for="(field) in fieldsListLocation"
            :key="field.columnName"
            :metadata-field="field"
          />
        </template>
        <div
          v-else
          key="form-loading"
          v-loading="!isLoaded"
          :element-loading-text="$t('notifications.loading')"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.8)"
          style="min-height: calc(50vh - 84px)"
          class="loading-panel"
        />

        <el-col :span="24">
          <samp style="float: right; padding-right: 10px;">
            <el-button
              :disabled="!isLoaded"
              type="primary"
              class="custom-button-address-location"
              icon="el-icon-check"
              @click="sendValuesToServer"
            />
            <el-button
              type="danger"
              class="custom-button-address-location"
              icon="el-icon-close"
              @click="setShowedLocationForm(false)"
            />
          </samp>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import mixinLocation from './mixinLocation.js'
import fieldsList from './fieldsList.js'
import {
  requestCreateLocationAddress,
  requestUpdateLocationAddress
} from '@/api/ADempiere/field/location.js'
import { showNotification } from '@/utils/ADempiere/notification.js'
import { getSequenceAsList } from '@/utils/ADempiere/location'

/**
 * TODO: Add sequence fields by country selected
 */
export default {
  name: 'LocationAdressFrom',
  mixins: [
    formMixin,
    mixinLocation
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          // TODO: Add container uuid parent
          uuid: 'Location-Address-Create',
          containerUuid: 'Location-Address-Create'
        }
      }
    },
    parentMetadata: {
      type: Object,
      default: () => {}
    },
    // TODO: Not working props
    values: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fieldsList,
      isCustomForm: true,
      request: 0
    }
  },
  computed: {
    fieldsListLocation() {
      if (!this.isEmptyValue(this.$store.getters.getFieldLocation)) {
        return this.$store.getters.getFieldLocation
      }
      return this.fieldsList
    },
    locationId() {
      return this.$store.getters.getValueOfField({
        parentUuid: this.parentMetadata.parentUuid,
        containerUuid: this.parentMetadata.containerUuid,
        columnName: this.parentMetadata.columnName
      })
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  mounted() {
    this.getLocation()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    keyAction(event) {
      if (event.srcKey === 'closeForm') {
        this.toggleShowedLocationForm()
      }
    },
    sortSequence(itemA, itemB) {
      return itemA.index - itemB.index
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        const withOutColumnNames = ['C_Country_ID', 'DisplayColumn_C_Country_ID', 'C_Location_ID']

        if (mutation.type === 'updateValueOfField' &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          if (mutation.payload.columnName === 'C_Country_ID') {
            const values = []
            // Get country definition to sequence fields and displayed value
            if (mutation.value !== this.currentCountryDefinition.countryId) {
              this.requestGetCountryDefinition({
                id: mutation.payload.value
              })
                .then(responseCountry => {
                  const newSequence = getSequenceAsList(responseCountry.captureSequence)
                  const newFieldsList = this.fieldsList.map(item => {
                    if (newSequence.includes(item.sequenceFields)) {
                      return {
                        ...item,
                        isDisplayed: true,
                        index: newSequence.indexOf(item.sequenceFields)
                      }
                    }
                    return {
                      ...item,
                      isDisplayed: false
                    }
                  })
                  this.$store.dispatch('changeSequence', newFieldsList.sort(this.sortSequence))
                })
                .catch(error => {
                  this.$message({
                    message: error.message,
                    isShowClose: true,
                    type: 'error'
                  })
                  console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
                })
            }

            fieldsList.forEach(item => {
              if (!withOutColumnNames.includes(item.columnName)) {
                values.push({
                  columnName: item.columnName,
                  value: undefined
                })
              }
            })

            this.setValues({
              values,
              withOutColumnNames
            })
          }
        }
      })
    },
    setParentValues(values) {
      const {
        parentUuid,
        containerUuid,
        columnName, // 'C_Location_ID' by default
        displayColumnName
      } = this.parentMetadata

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName,
        value: values[columnName]
      })

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        // DisplayColumn_'ColumnName'
        columnName: displayColumnName,
        value: this.getDisplayedValue(values)
      })

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'Postal',
        value: values.Postal
      })

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_Country_ID',
        value: values.C_Country_ID
      })

      this.$store.commit('updateValueOfField', {
        parentUuid,
        containerUuid,
        columnName: 'C_City_ID',
        value: values.C_City_ID
      })

      // active update record to server
      // this.$store.dispatch('notifyFieldChange', {
      //   containerUuid,
      //   field: this.parentMetadata
      // })
    },
    sendValuesToServer() {
      const fieldsNotReady = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid
      })
      if (!this.isEmptyValue(fieldsNotReady)) {
        showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues'),
          name: '<b>' + fieldsNotReady + '.</b> ',
          message: this.$t('notifications.fieldMandatory'),
          isRedirect: false
        })
        return
      }

      const locationId = this.locationId

      const attributes = this.$store.getters.getValuesView({
        containerUuid: this.containerUuid
      })
      const attributesToServer = attributes.filter(attributeItem => {
        const { columnName } = attributeItem
        if (columnName.includes('DisplayColumn_')) {
          return false
        }
        if (columnName === 'C_Location_ID') {
          return false
        }
        return true
      })

      const updateLocation = (responseLocation) => {
        // set form values
        this.setValues({
          values: responseLocation.attributes
        })

        // set field parent values
        this.setParentValues(responseLocation.attributes)
        this.setShowedLocationForm(false)

        // set context values to parent continer
        if (this.parentMetadata.isSendParentValues) {
          this.$store.dispatch('updateValuesOfContainer', {
            parentUuid: this.parentMetadata.parentUuid,
            containerUuid: this.parentMetadata.containerUuid,
            attributes
          })
        }
      }

      if (this.isEmptyValue(locationId) || locationId === 0) {
        requestCreateLocationAddress({
          attributesList: attributesToServer
        })
          .then(updateLocation)
          .catch(error => {
            this.$message({
              message: error.message,
              isShowClose: true,
              type: 'error'
            })
            console.warn(`Error create Location Address: ${error.message}. Code: ${error.code}.`)
          })
        // break to only create
        return
      }
      requestUpdateLocationAddress({
        id: locationId,
        attributesList: attributesToServer
      })
        .then(updateLocation)
        .catch(error => {
          this.$message({
            message: error.message,
            isShowClose: true,
            type: 'error'
          })
          console.warn(`Error update Location Address: ${error.message}. Code: ${error.code}.`)
        })
      this.$store.dispatch('changeSequence', fieldsList)
    },
    getLocation() {
      if (this.request > 0) {
        return
      }

      if (!this.isEmptyValue(this.values)) {
        this.setValues({
          values: this.values
        })
        return
      }

      const id = this.locationId
      if (this.isEmptyValue(id)) {
        return
      }

      this.requestGetLocationAddress({
        id
      })
        .then(responseLocation => {
          const { values } = responseLocation

          this.setValues({
            values
          })
          this.request++
        })
        .catch(error => {
          console.warn(`Get Location Address, Form Location - Error ${error.code}: ${error.message}.`)
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .location-address {
    .el-form-item {
        margin-bottom: 0px !important;
    }

    .custom-button-address-location {
      float: right;
      margin-right: 10px;
    }
  }
</style>
<style lang="scss">
.location-address {
  .el-form-item--small .el-form-item__label {
    line-height: 22px !important;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
  }
}
</style>
