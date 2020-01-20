<template>
  <span>
    <el-popover
      ref="translatedField"
      placement="top"
      width="300"
      trigger="click"
      @show="getTranslation"
    >
      <div>
        <span class="custom-tittle-popover">
          {{ name }}
        </span>
        <template v-if="!isEmptyValue(help)">
          : {{ help }}
        </template>
      </div>
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
          @change="getTranslation"
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
        label="Translated Value:"
        :required="true"
      >
        <el-input
          v-model="translatedValue"
          :disabled="isEmptyValue(langValue)"
          @change="changeTranslationValue"
        />
      </el-form-item>
    </el-popover>
    <svg-icon
      v-popover:translatedField
      class-name="international-icon"
      icon-class="language"
    />
  </span>
</template>

<script>
import { getLanguage } from '@/lang/index'

export default {
  name: 'FieldTranslated',
  props: {
    containerUuid: {
      type: String,
      required: true
    },
    columnName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: undefined
    },
    help: {
      type: String,
      default: undefined
    },
    recordUuid: {
      type: String,
      default: undefined
    },
    tableName: {
      type: String,
      required: true
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
        containerUuid: this.containerUuid,
        language: this.langValue,
        recordUuid: this.recordUuid
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
      return values[this.columnName]
    }
  },
  watch: {
    gettterValue(newValue, oldValue) {
      this.translatedValue = newValue
    }
  },
  created() {
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
        containerUuid: this.containerUuid,
        recordUuid: this.recordUuid,
        tableName: this.tableName,
        language: this.langValue
      })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeTranslationValue(value) {
      this.$store.dispatch('changeTranslationValue', {
        containerUuid: this.containerUuid,
        language: this.langValue,
        columnName: this.columnName,
        value
      })
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
