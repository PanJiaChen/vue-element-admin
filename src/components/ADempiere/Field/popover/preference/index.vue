<template>
  <el-dropdown trigger="click">
    <el-button type="text" :disabled="fieldAttributes.readonly">
      <i class="el-icon-notebook-2 el-icon--right" @click="isActive = !isActive" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="dropdown-calc">
      <el-card
        v-if="!isEmptyValue(metadataList)"
        class="box-card"
      >
        <div slot="header" class="clearfix">
          <span>
            {{ $t('components.preference.title') }}
            <b>
              {{ fieldAttributes.name }}
            </b>
          </span>
        </div>
        <div v-if="!isEmptyValue(descriptionOfPreference)" class="text item">
          {{
            descriptionOfPreference
          }}
          <template
            v-for="(index) in fieldsListPreference"
          >
            <span
              v-if="index.value"
              :key="index.sequence"
            >
              {{
                index.label
              }}
            </span>
          </template>
        </div>
        <br>
        <div class="text item">
          <el-form
            :inline="true"
          >
            <el-form-item>
              <p slot="label">
                {{ fieldAttributes.name }}
              </p>
              <el-switch
                v-if="fieldAttributes.componentPath === 'FieldYesNo'"
                v-model="code"
                :active-text="$t('components.preference.yes')"
                :inactive-text="$t('components.preference.no')"
                :disabled="true"
                style="padding-top: 30%"
              />
              <div
                v-else
              >
                <p>
                  {{
                    code
                  }}
                </p>
              </div>
            </el-form-item>
          </el-form>
          <el-form
            label-position="top"
            :inline="true"
            class="demo-form-inline"
            size="medium"
          >
            <el-form-item
              v-for="(field) in metadataList"
              :key="field.sequence"
            >
              <p slot="label">
                {{ field.name }}
              </p>
              <el-switch
                v-model="field.value"
              />
            </el-form-item>
          </el-form>
        </div>
        <br>
        <el-row>
          <el-col :span="24">
            <samp style="float: right; padding-right: 10px;">
              <el-button
                type="danger"
                class="custom-button-address-location"
                icon="el-icon-close"
                @click="close()"
              />
              <el-button
                type="primary"
                class="custom-button-address-location"
                icon="el-icon-check"
                @click="close()"
              />
            </samp>
          </el-col>
        </el-row>
      </el-card>
      <div
        v-else
        v-loading="isEmptyValue(metadataList)"
        :element-loading-text="$t('notifications.loading')"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        class="loading-window"
      />
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// import { ID, INTEGER } from '@/utils/ADempiere/references'
import filelistPreference from './filelistPreference.js'
import { getPreference } from '@/api/ADempiere/field/preference.js'
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { attributePreference } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'Preference',
  props: {
    fieldAttributes: {
      type: [Object],
      required: true,
      default: null
    },
    fieldValue: {
      type: [String, Number, Boolean, Date, Array, Object],
      required: true,
      default: ''
    },
    containerUuid: {
      type: String,
      default: 'fiel-reference'
    },
    panelType: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      filelistPreference,
      metadataList: [],
      code: '',
      description: [],
      isActive: false,
      unsubscribe: () => {}
    }
  },
  computed: {
    fieldsListPreference() {
      return this.metadataList.map(item => {
        return {
          label: item.name,
          value: item.value,
          columnName: item.columnName,
          sequence: item.sequence
        }
      })
    },
    descriptionOfPreference() {
      const label = this.fieldsListPreference.filter(element => {
        return element.value
      })
      if (!this.isEmptyValue(label)) {
        if (label[0].columnName === 'AD_User_ID') {
          return this.$t('components.preference.defaulMessageUser')
        }
        return this.$t('components.preference.defaulMessage')
      }
      return []
    }
  },
  watch: {
    isActive(value) {
      const preferenceValue = this.fieldValue
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      if (!this.isEmptyValue(preferenceValue)) {
        if ((typeof preferenceValue !== 'string') && (this.fieldAttributes.componentPath !== 'FieldYesNo')) {
          this.code = preferenceValue
        } else {
          this.code = preferenceValue
        }
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    createFieldFromDictionary,
    attributePreference,
    close() {
      this.$children[0].visible = false
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.filelistPreference.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'fiel-reference'
            })
            if (data.value) {
              this.description.push(data.name)
            }
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = fieldsList
    },
    sendValue(list) {
      const preference = this.attributePreference({
        containerUuid: this.containerUuid,
        panelType: this.panelType,
        attribute: this.fieldAttributes.columnName,
        value: this.code,
        level: list
      })
      getPreference(preference)
    },
    changeValue(value) {
      switch (value.columName) {
        // case 'options':
        case 'AD_Client_ID':
          this.$store.commit('updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_Org_ID':
          this.$store.commit('updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_User_ID':
          this.$store.commit('updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
        case 'AD_Window_ID':
          this.$store.commit('updateValueOfField', {
            containerUuid: 'fiel-reference',
            columnName: value.columName,
            value: value.value
          })
          break
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          // const values = this.$store.getters.getValuesView({
          //   containerUuid: mutation.payload.containerUuid,
          //   format: 'object'
          // })
          // this.changeValue(values)
        }
      })
    }
  }
}
</script>

<style>
 .title {
    color: #000000;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
  .value {
    color: #606266;
    text-size-adjust: 20px;
    font-size: 120%;
    /* font-weight: 605!important;
    left: 50%; */
  }
</style>
