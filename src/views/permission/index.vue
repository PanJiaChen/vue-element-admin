<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">{{$t('permission.roles')}}： {{roles}}</div>
    {{$t('permission.switchRoles')}}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor"></el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default{
  name: 'permission',
  data() {
    return {
      switchRoles: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {
    switchRoles(val) {
      this.$store.dispatch('ChangeRoles', val).then(() => {
        this.$router.push({ path: '/permission/index?' + +new Date() })
      })
    }
  }
}
</script>
