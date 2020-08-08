<template>
  <div class="user-profi">
    <router-link to="/profile/index">
      <img v-if="logo" :src="logo" class="sidebar-logo">
      <p style="float: right;max-width: 150px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
        {{ currentRole.clientName }}
      </p>
    </router-link>
    <roles-navbar />
  </div>
</template>

<script>
import RolesNavbar from '@/views/profile/components/RolesNavbar'

export default {
  components: {
    RolesNavbar
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      logo: 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4?imageView2/1/w/80/h/80'
    }
  },
  computed: {
    currentRole() {
      return this.$store.getters['user/getRole']
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
