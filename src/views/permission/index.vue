<template>
  <div class="app-container">
    <div style="margin-bottom:15px;">{{translateKey('permissions')}}： {{roles}}</div>
    {{translateKey('switchPermissions')}}：
    <el-radio-group v-model="role">
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
      role: ''
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  watch: {
    role(val) {
      this.$store.dispatch('ChangeRole', val).then(() => {
        this.$router.push({ path: '/permission/index?' + +new Date() })
      })
    }
  },
  methods: {
    translateKey(key) {
      return this.$t('permission.' + key)
    }
  }
}
</script>
