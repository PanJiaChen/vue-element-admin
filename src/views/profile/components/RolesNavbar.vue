<template>
  <el-form>
    <el-select
      v-model="value"
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
  </el-form>
</template>

<script>
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'RolesNavbar',
  data() {
    return {
      value: '',
      options: []
    }
  },
  computed: {
    getRol() {
      return this.$store.getters['user/getRol']
    },
    getRolesList() {
      return this.$store.getters['user/getRoles']
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
      this.value = uuidRol
    }
  },
  created() {
    this.value = this.getRol.uuid
    this.getLanguageData()
  },
  methods: {
    showMessage,
    handleChange(valueSelected) {
      this.$message({
        message: this.$t('notifications.loading'),
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRoles', {
        roleUuid: valueSelected
      })
        .then(response => {
          this.$store.dispatch('listDashboard', response.uuid)
        })
      this.$router.push({ path: '/' })
    },
    getLanguageData() {
      this.$store.dispatch('getLanguagesFromServer')
    }
  }
}
</script>
