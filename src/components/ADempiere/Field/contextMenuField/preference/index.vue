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
  <el-card
    v-if="!isEmptyValue(metadataList)"
    class="box-card"
  >
    <div slot="header" class="clearfix">
      <span>
        {{ $t('components.preference.title') }}
        <b>
          {{ sourceField.name }}
          {{
            fieldValue
          }}
        </b>
      </span>
    </div>
    <div class="text item">
      {{
        getDescriptionOfPreference
      }}
    </div>
    <br>
    <div class="text item">
      <el-form
        :inline="true"
      >
        <el-form-item>
          <p slot="label">
            {{ sourceField.name }}: {{ fieldValue }}
          </p>
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
        <samp style="float: left; padding-right: 10px;">
          <el-button
            type="danger"
            class="custom-button-address-location"
            icon="el-icon-delete"
            @click="remove()"
          />
        </samp>
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
            @click="sendValue()"
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
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin'
import preferenceFields from './preferenceFields.js'
import { createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'
import { setPreference, deletePreference } from '@/api/ADempiere/field/preference.js'
import { showMessage } from '@/utils/ADempiere/notification.js'
import language from '@/lang'

export default {
  name: 'Preference',
  mixins: [formMixin],
  props: {
    sourceField: {
      type: [Object],
      required: true,
      default: null
    },
    fieldValue: {
      type: [String, Number, Boolean, Date, Array, Object],
      required: true,
      default: ''
    }
  },
  data() {
    return {
      preferenceFields,
      metadataList: [],
      code: '',
      description: [],
      isActive: false
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
    getDescriptionOfPreference() {
      if (this.isEmptyValue(this.metadataList)) {
        return ''
      }
      const forCurrentUser = this.metadataList.find(field => field.columnName === 'AD_User_ID')
      const forCurrentClient = this.metadataList.find(field => field.columnName === 'AD_Client_ID')
      const forCurrentOrganization = this.metadataList.find(field => field.columnName === 'AD_Org_ID')
      const forCurrentContainer = this.metadataList.find(field => field.columnName === 'AD_Window_ID')
      if (!forCurrentClient) {
        return ''
      }
      //  Create Message
      var expl = language.t('components.preference.for')//  components.preference.for
      if (forCurrentOrganization && forCurrentClient) {
        if (forCurrentClient.value && forCurrentOrganization.value) {
          expl = expl.concat(language.t('components.preference.clientAndOrganization'))//  components.preference.clientAndOrganization
        } else if (forCurrentClient.value && !forCurrentOrganization.value) {
          expl = expl.concat(language.t('components.preference.allOrganizationOfClient'))//  components.preference.allOrganizationOfClient
        } else if (!forCurrentClient.value && forCurrentOrganization.value) {
          forCurrentOrganization.value = false
          expl = expl.concat(language.t('components.preference.entireSystem'))//  components.preference.entireSystem
        } else {
          expl = expl.concat(language.t('components.preference.entireSystem'))//  components.preference.entireSystem
        }
      }
      if (forCurrentUser && forCurrentContainer) {
        if (forCurrentUser.value) {
          expl = expl.concat(language.t('components.preference.thisUser'))//  components.preference.thisUser
        } else {
          expl = expl.concat(language.t('components.preference.allUsers'))//  components.preference.allUsers
        }
        if (forCurrentContainer.value) {
          expl = expl.concat(language.t('components.preference.thisWindow'))//  components.preference.thisWindow
        } else {
          expl = expl.concat(language.t('components.preference.allWindows'))//  components.preference.allWindows
        }
      }
      return expl
    }
  },
  watch: {
    isActive(value) {
      const preferenceValue = this.fieldValue
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      if (!this.isEmptyValue(preferenceValue)) {
        if ((typeof preferenceValue !== 'string') && (this.sourceField.componentPath !== 'FieldYesNo')) {
          this.code = preferenceValue
        } else {
          this.code = preferenceValue
        }
      }
    }
  },
  beforeMount() {
    if (this.isEmptyValue(this.metadataList)) {
      this.setFieldsList()
    }
  },
  methods: {
    createFieldFromDictionary,
    close() {
      this.$children[0].visible = false
      this.$store.commit('changeShowRigthPanel', false)
      if (!this.isEmptyValue(this.$route.query.fieldColumnName)) {
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
      }
    },
    remove() {
      const isForCurrentUser = this.metadataList.find(field => field.columnName === 'AD_User_ID').value
      const isForCurrentClient = this.metadataList.find(field => field.columnName === 'AD_Client_ID').value
      const isForCurrentOrganization = this.metadataList.find(field => field.columnName === 'AD_Org_ID').value
      const isForCurrentContainer = this.metadataList.find(field => field.columnName === 'AD_Window_ID').value
      deletePreference({
        parentUuid: this.sourceField.parentUuid,
        attribute: this.sourceField.columnName,
        isForCurrentUser,
        isForCurrentClient,
        isForCurrentOrganization,
        isForCurrentContainer
      })
        .then(preference => {
          showMessage({
            message: language.t('components.preference.preferenceRemoved')
          })
          this.close()
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`setPreference error: ${error.message}.`)
        })
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.preferenceFields.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'field-reference'
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
      const isForCurrentUser = this.metadataList.find(field => field.columnName === 'AD_User_ID').value
      const isForCurrentClient = this.metadataList.find(field => field.columnName === 'AD_Client_ID').value
      const isForCurrentOrganization = this.metadataList.find(field => field.columnName === 'AD_Org_ID').value
      const isForCurrentContainer = this.metadataList.find(field => field.columnName === 'AD_Window_ID').value
      //
      setPreference({
        parentUuid: this.sourceField.parentUuid,
        attribute: this.sourceField.columnName,
        value: this.fieldValue,
        isForCurrentUser,
        isForCurrentClient,
        isForCurrentOrganization,
        isForCurrentContainer
      })
        .then(preference => {
          showMessage({
            message: language.t('components.preference.preferenceIsOk')
          })
          this.close()
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          this.close()
          console.warn(`setPreference error: ${error.message}.`)
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
