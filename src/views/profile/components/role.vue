<template>
  <el-form>
    <el-form-item :label="$t('profile.currentRole')">
      {{ getRole.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.clientName')">
      {{ getRole.clientName }}
    </el-form-item>

    <el-form-item :label="$t('profile.description')">
      {{ getRole.description }}
    </el-form-item>

    <el-form-item :label="$t('profile.changeRole')">
      <el-select
        v-model="valueRol"
        :filterable="!isMobile"
        value-key="key"
        @change="handleChange"
      >
        <el-option
          v-for="(rol, key) in getRolesList"
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
        @visible-change="getLanguageList"
        @change="changeLanguage"
      >
        <el-option
          v-for="item in getterLanguageList"
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
import { showMessage } from '@/utils/ADempiere'

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
    getRole() {
      return this.$store.getters['user/getRole']
    },
    getRolesList() {
      return this.$store.getters['user/getRoles']
    },
    getterLanguageList() {
      return this.$store.getters.getLanguagesList
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    'getRole.uuid'(uuidRol) {
      this.valueRol = uuidRol
    }
  },
  created() {
    this.valueRol = this.getRole.uuid
    this.getLanguageData()
  },
  methods: {
    showMessage,
    handleChange(valueSelected) {
      this.$message({
        message: this.$t('notifications.loading'),
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
    getLanguageList(open) {
      if (open) {
        this.getLanguageData()
      }
    },
    getLanguageData() {
      if (this.isEmptyValue(this.getterLanguageList)) {
        this.$store.dispatch('getLanguagesFromServer')
      }
    }
  }
}
</script>
