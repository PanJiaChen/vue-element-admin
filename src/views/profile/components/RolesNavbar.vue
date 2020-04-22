<template>
  <el-form>
    <el-select
      v-model="roleUuid"
      :filterable="!isMobile"
      value-key="key"
      @change="changeRole"
    >
      <el-option
        v-for="(role, key) in getRolesList"
        :key="key"
        :label="role.name"
        :value="role.uuid"
        :disabled="isEmptyValue(role.uuid)"
      />
    </el-select>
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
    <el-select
      v-model="warehouseUuid"
      :filterable="!isMobile"
      value-key="key"
      @change="changeWarehouse"
    >
      <el-option
        v-for="(warehouse, key) in getWarehousesList"
        :key="key"
        :label="warehouse.name"
        :value="warehouse.uuid"
        :disabled="isEmptyValue(warehouse.uuid)"
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
      roleUuid: '',
      organizationUuid: '',
      warehouseUuid: ''
    }
  },
  computed: {
    getRole() {
      return this.$store.getters['user/getRole']
    },
    getOrganization() {
      return this.$store.getters['user/getOrganization']
    },
    getWarehouse() {
      return this.$store.getters['user/getWarehouse']
    },
    getRolesList() {
      return this.$store.getters['user/getRoles']
    },
    getOrganizationsList() {
      return this.$store.getters['user/getOrganizations']
    },
    getWarehousesList() {
      return this.$store.getters['user/getWarehouses']
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  created() {
    this.roleUuid = this.getRole.uuid
    this.organizationUuid = this.getOrganization.uuid
    this.warehouseUuid = this.getWarehouse.uuid
    this.getLanguageData()
  },
  methods: {
    showMessage,
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
          this.$store.dispatch('listDashboard', response.uuid)
        })
      this.$router.push({ path: '/' })
    },
    changeOrganization(organizationUuid) {
      this.$store.dispatch('user/changeOrganization', {
        organizationUuid
      })
      this.warehouseUuid = this.getWarehouse
    },
    changeWarehouse(warehouseUuid) {
      this.$store.dispatch('user/changeWarehouse', {
        warehouseUuid
      })
    },
    getLanguageData() {
      this.$store.dispatch('getLanguagesFromServer')
    }
  }
}
</script>
