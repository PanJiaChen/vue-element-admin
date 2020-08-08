<template>
  <el-form>
    {{ $t('route.role') }}
    <el-select
      v-model="roleUuid"
      :filterable="!isMobile"
      value-key="key"
      @change="changeRole"
    >
      <el-option
        v-for="(role, key) in rolesList"
        :key="key"
        :label="role.name"
        :value="role.uuid"
        :disabled="isEmptyValue(role.uuid)"
      />
    </el-select>
    {{ $t('route.organization') }}
    <el-select
      v-model="organizationUuid"
      :filterable="!isMobile"
      value-key="key"
      @change="changeOrganization"
    >
      <el-option
        v-for="(organization, key) in getOrganizationsList"
        :key="key"
        :label="organization.name"
        :value="organization.uuid"
        :disabled="isEmptyValue(organization.uuid)"
      />
    </el-select>
    {{ $t('route.warehouse') }}
    <el-select
      v-model="warehouseUuid"
      :filterable="!isMobile"
      value-key="key"
      @change="changeWarehouse"
    >
      <el-option
        v-for="(warehouse, key) in warehousesList"
        :key="key"
        :label="warehouse.name"
        :value="warehouse.uuid"
        :disabled="isEmptyValue(warehouse.uuid)"
      />
    </el-select>
  </el-form>
</template>

<script>
export default {
  name: 'RolesNavbar',
  data() {
    return {
      roleUuid: '',
      organizationUuid: '',
      warehouseUuid: ''
    }
  },
  computed: {
    // TODO: Add double chanel
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    rolesList() {
      return this.$store.getters['user/getRoles']
    },
    getOrganization() {
      return this.$store.getters['user/getOrganization']
    },
    getOrganizationsList() {
      return this.$store.getters['user/getOrganizations']
    },
    currentWarehouse() {
      return this.$store.getters['user/getWarehouse']
    },
    warehousesList() {
      return this.$store.getters['user/getWarehouses']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  watch: {
    getOrganizationsList(value) {
      this.organizationUuid = this.isEmptyValue(value) ? '' : value[0].uuid
    },
    warehousesList(value) {
      this.warehouseUuid = this.isEmptyValue(value) ? '' : value[0].uuid
    }
  },
  created() {
    this.roleUuid = this.currentRole.uuid
    this.organizationUuid = this.getOrganization.uuid
    this.warehouseUuid = this.currentWarehouse.uuid
    this.getLanguages()
  },
  methods: {
    changeRole(roleUuid) {
      this.$message({
        message: this.$t('notifications.loading'),
        iconClass: 'el-icon-loading'
      })
      this.$store.dispatch('user/changeRole', {
        roleUuid,
        organizationUuid: this.organizationUuid,
        warehouseUuid: this.warehouseUuid
      })
        .then(response => {
          if (this.$route.name !== 'Dashboard') {
            this.$router.push({
              path: '/'
            }).catch(error => {
              console.info(`${this.name} Component: ${error.name}, ${error.message}`)
            })
          }
          this.$store.dispatch('listDashboard', response.uuid)
        })
    },
    changeOrganization(organizationUuid) {
      const currentOrganization = this.getOrganizationsList.find(element => element.uuid === organizationUuid)
      this.$router.push({
        path: '/'
      }).catch(error => {
        console.info(`${this.name} Component: ${error.name}, ${error.message}`)
      })
      this.$store.dispatch('user/changeOrganization', {
        organizationUuid: organizationUuid,
        organizationId: currentOrganization.id
      })
      this.warehouseUuid = this.currentWarehouse
    },
    // TODO: Add change local list with server list
    changeWarehouse(warehouseUuid) {
      this.$store.dispatch('user/changeWarehouse', {
        warehouseUuid
      })
    },
    getLanguages() {
      if (this.isEmptyValue(this.getLanguageList)) {
        this.$store.dispatch('user/getLanguagesFromServer')
      }
    }
  }
}
</script>
