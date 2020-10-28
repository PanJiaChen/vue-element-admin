<template>
  <el-form>
    {{ $t('route.role') }}
    <el-select
      v-model="currentRoleUuid"
      :filterable="isFiltrable"
      value-key="key"
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
      v-model="currentOrganizationUuid"
      :filterable="isFiltrable"
      value-key="key"
      @visible-change="showOrganizationsList"
    >
      <el-option
        v-for="(organization, key) in organizationsList"
        :key="key"
        :label="organization.name"
        :value="organization.uuid"
        :disabled="isEmptyValue(organization.uuid)"
      />
    </el-select>

    {{ $t('route.warehouse') }}
    <el-select
      v-model="currentWarehouseUuid"
      :filterable="isFiltrable"
      value-key="key"
      @visible-change="showWarehouseList"
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
  computed: {
    currentRoleUuid: {
      get() {
        return this.$store.getters['user/getRole'].uuid
      },
      set(roleToSet) {
        this.changeRole(roleToSet)
      }
    },
    rolesList() {
      return this.$store.getters['user/getRoles']
    },
    currentOrganizationUuid: {
      get() {
        const organization = this.$store.getters['user/getOrganization']
        if (organization) {
          return organization.uuid
        }
        return ''
      },
      set(organizationToSet) {
        this.changeOrganization(organizationToSet)
      }
    },
    organizationsList() {
      return this.$store.getters['user/getOrganizations']
    },
    currentWarehouseUuid: {
      get() {
        const warehouse = this.$store.getters['user/getWarehouse']
        if (warehouse) {
          return warehouse.uuid
        }
        return ''
      },
      set(warehouseToSet) {
        this.changeWarehouse(warehouseToSet)
      }
    },
    warehousesList() {
      return this.$store.getters['user/getWarehouses']
    },
    isFiltrable() {
      return this.$store.state.app.device !== 'mobile'
    }
  },
  created() {
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
        organizationUuid: this.currentOrganizationUuid,
        warehouseUuid: this.warehouseUuid
      })
        .then(response => {
          if (this.$route.name !== 'Dashboard') {
            this.$router.push({
              path: '/'
            }, () => {})
          }
          this.$store.dispatch('listDashboard', {
            roleId: response.id,
            roleUuid: response.uuid
          })
        })
    },
    changeOrganization(organizationUuid) {
      const currentOrganization = this.organizationsList.find(element => element.uuid === organizationUuid)
      this.$router.push({
        path: '/'
      }, () => {})
      this.$store.dispatch('user/changeOrganization', {
        organizationUuid,
        organizationId: currentOrganization.id
      })
    },
    showOrganizationsList(isShow) {
      if (isShow && this.isEmptyValue(this.organizationsList)) {
        this.$store.dispatch('user/getOrganizationsListFromServer', this.currentRoleUuid)
      }
    },
    changeWarehouse(warehouseUuid) {
      this.$store.dispatch('user/changeWarehouse', {
        warehouseUuid
      })
    },
    showWarehouseList(isShow) {
      if (isShow && this.isEmptyValue(this.warehousesList)) {
        this.$store.dispatch('user/getWarehousesList', this.currentOrganizationUuid)
      }
    },
    getLanguages() {
      if (this.isEmptyValue(this.getLanguageList)) {
        this.$store.dispatch('getLanguagesFromServer')
      }
    }
  }
}
</script>
