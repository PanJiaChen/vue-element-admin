<template>
  <el-form>
    <el-form-item :label="$t('profile.currentRole')">
      {{ currentRole.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.clientName')">
      {{ currentRole.clientName }}
    </el-form-item>

    <el-form-item :label="$t('profile.description')">
      {{ currentRole.description }}
    </el-form-item>

    <el-form-item :label="$t('profile.changeRole')">
      <el-select
        v-model="valueRol"
        :filterable="!isMobile"
        value-key="key"
        @change="handleChange"
      >
        <el-option
          v-for="(rol, key) in rolesList"
          :key="key"
          :label="rol.name"
          :value="rol.uuid"
          :disabled="isEmptyValue(rol.uuid)"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('profile.changeLanguage')">
      <el-select
        v-model="currentLanguage"
        :filterable="true"
        value-key="key"
        :placeholder="$t('profile.changeLanguagePlaceholder')"
        @visible-change="loadLanguageList"
        @change="changeLanguage"
      >
        <el-option
          v-for="item in languagesList"
          :key="item.value"
          :label="item.languageName"
          :value="item.languageISO"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
import { getLanguage } from '@/lang'

export default {
  name: 'ProfileRole',
  data() {
    return {
      valueRol: '',
      options: [],
      currentLanguage: getLanguage()
    }
  },
  computed: {
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    rolesList() {
      return this.$store.getters['user/getRoles']
    },
    languagesList() {
      return this.$store.getters.getLanguagesList
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  watch: {
    'currentRole.uuid'(uuidRol) {
      this.valueRol = uuidRol
    }
  },
  created() {
    this.valueRol = this.currentRole.uuid
    this.getLanguages()
  },
  methods: {
    handleChange(valueSelected) {
      this.$message({
        message: this.$t('notifications.loading'),
        showClose: true,
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRole', {
        roleUuid: valueSelected,
        isCloseAllViews: false
      })
    },
    changeLanguage(languageValue) {
      this.currentLanguage = languageValue
    },
    loadLanguageList(open) {
      if (open) {
        this.getLanguages()
      }
    },
    getLanguages() {
      if (this.isEmptyValue(this.languagesList)) {
        this.$store.dispatch('getLanguagesFromServer')
      }
    }
  }
}
</script>
