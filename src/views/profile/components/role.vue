<template>
  <el-form>
    <el-form-item :label="$t('profile.currentRole')">
      {{ getRol.name }}
    </el-form-item>

    <el-form-item :label="$t('profile.clientName')">
      {{ getRol.clientName }}
    </el-form-item>

    <el-form-item :label="$t('profile.description')">
      {{ getRol.description }}
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
import { resetRouter } from '@/router'

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
    getRol() {
      return this.$store.getters['user/getRol']
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
    'getRol.uuid'(uuidRol) {
      this.valueRol = uuidRol
    }
  },
  created() {
    this.valueRol = this.getRol.uuid
    this.getLanguageData()
  },
  methods: {
    showMessage,
    resetRouter,
    handleChange(valueSelected) {
      this.$message({
        message: this.$t('notifications.loading'),
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRoles', valueSelected)
        .then(response => {
          this.showMessage({
            message: this.$t('notifications.successChangeRole'),
            type: 'success'
          })
          this.$store.dispatch('permission/generateRoutes')
            .then(response => {
              this.resetRouter()
              response.forEach(element => {
                this.$router.resolve(element)
              })
              this.$router.addRoutes(response)
            })
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
          .catch(error => {
            console.warn(`Error getting languages list: ${error.message}. Code: ${error.code}.`)
          })
      }
    }
  }
}
</script>
