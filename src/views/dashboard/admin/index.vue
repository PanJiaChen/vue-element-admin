<template>
  <div class="dashboard-editor-container">
    <el-row v-if="!isEmptyValue(listDashboard)" :gutter="8">
      <el-col v-if="!isEmptyValue(maindashboard)" :span="24" style="padding-right:8px;margin-bottom:2px;">
        <dashboard
          :metadata="maindashboard"
          :title="maindashboard.name"
        />
      </el-col>
      <template v-for="(dashboardAttributes, index) in listDashboard">
        <el-col :key="index" :xs="{ span: 24 }" :sm="{ span: 24 }" :md="{ span: 24 }" :lg="{ span: 12 }" :xl="{ span: 12 }" style="padding-right:8px;margin-bottom:2px;">
          <dashboard
            :metadata="dashboardAttributes"
            :title="dashboardAttributes.name"
            :main="true"
          />
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import Dashboard from '@/components/ADempiere/Dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    Dashboard
  },
  data() {
    return {
      roleUuid: this.$store.getters.getRoleUuid,
      dashboardList: []
    }
  },
  computed: {
    listDashboard() {
      const list = this.$store.getters.getDashboard
      return list.filter(dashboard => this.maindashboard.id !== dashboard.id)
    },
    currentRole() {
      return this.$store.getters['user/getRole']
    },
    getterRol() {
      return this.$store.getters.getRoleUuid
    },
    maindashboard() {
      return this.$store.getters.getMainDashboard
    }
  },
  watch: {
    getterRol(value) {
      this.getDashboardListFromServer()
    },
    maindashboard(value) {
      this.getDashboardListFromServer()
    }
  },
  mounted() {
    this.getDashboardListFromServer()
  },
  methods: {
    getDashboardListFromServer() {
      this.$store.dispatch('listDashboard', {
        roleId: this.currentRole.id,
        roleUuid: this.currentRole.uuid
      })
        .then(response => {
          if (this.isEmptyValue(this.maindashboard)) {
            this.$store.dispatch('mainDashboard', response.dashboardsList[0])
          }
          this.dashboardList = response.dashboardsList
          this.$forceUpdate()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
