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
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.field') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <div>
      <el-form ref="form" label-position="top">
        <el-form-item :label="$t('field.container.description')">
          {{ fieldAttributes.description }}
        </el-form-item>
        <el-form-item :label="$t('field.container.help')">
          {{ fieldAttributes.help }}
        </el-form-item>
        <el-form-item
          :required="true"
        >
          <template slot="label">
            {{ $t('language') + ':' }}
          </template>
          <el-select
            v-model="langValue"
            size="medium"
            style="width: 100%;"
            filterable
          >
            <!-- <el-option
              key="blank-option"
              :value="undefined"
              label=" "
            /> -->
            <el-option
              v-for="(optionLang, key) in languageList"
              :key="key"
              :value="optionLang.language"
              :label="optionLang.languageName"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('field.codeTranslation') + fieldAttributes.name"
          :required="true"
        >
          <el-input
            v-model="translatedValue"
            :disabled="isEmptyValue(langValue)"
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
            @click="changeTranslationValue(translatedValue)"
          />
        </samp>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getLanguage } from '@/lang/index'

export default {
  name: 'FieldTranslated',
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    recordUuid: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      langValue: undefined,
      translatedValue: '',
      isLoading: false
    }
  },
  computed: {
    languageList() {
      return this.$store.getters.getLanguagesList.filter(itemLanguage => {
        return !itemLanguage.isBaseLanguage
      })
    },
    icon() {
      if (this.isLoading) {
        return 'el-icon-loading'
      }
      return 'el-icon-refresh'
    },
    getterTranslationValues() {
      const values = this.$store.getters.getTranslationByLanguage({
        containerUuid: this.fieldAttributes.containerUuid,
        language: this.langValue,
        recordUuid: this.fieldAttributes.recordUuid
      })
      if (this.isEmptyValue(values)) {
        return undefined
      }
      return values
    },
    gettterValue() {
      const values = this.getterTranslationValues
      if (this.isEmptyValue(values)) {
        return undefined
      }
      return values[this.fieldAttributes.columnName]
    }
  },
  watch: {
    gettterValue(newValue, oldValue) {
      this.translatedValue = newValue
    }
  },
  created() {
    this.getTranslation()
    let langMatch = this.languageList.find(itemLanguage => {
      return itemLanguage.languageISO === getLanguage()
    })
    if (langMatch) {
      langMatch = langMatch.language
    } else {
      langMatch = this.languageList[0].language
    }
    this.langValue = langMatch
  },
  methods: {
    getTranslation() {
      if (this.isEmptyValue(this.getterTranslationValues)) {
        this.getTranslationsFromServer()
      }
    },
    getTranslationsFromServer() {
      this.isLoading = true
      this.$store.dispatch('getTranslationsFromServer', {
        containerUuid: this.fieldAttributes.containerUuid,
        recordUuid: this.fieldAttributes.recordUuid,
        tableName: this.fieldAttributes.tableName,
        language: this.langValue
      })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeTranslationValue(value) {
      this.$store.dispatch('changeTranslationValue', {
        containerUuid: this.fieldAttributes.containerUuid,
        language: this.langValue,
        columnName: this.fieldAttributes.columnName,
        recordUuid: this.fieldAttributes.recordUuid,
        value
      })
      this.close()
    },
    close() {
      this.$children[0].visible = false
      this.$store.commit('changeShowRigthPanel', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
</style>
