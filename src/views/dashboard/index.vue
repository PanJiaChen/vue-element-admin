<template>
    <div class="dashboard-container">
        <component v-bind:is="currentRole"> </component>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import EditorDashboard from './editor/index';
    import DefaultDashboard from './default/index';
    export default {
      name: 'dashboard',
      components: { EditorDashboard, DefaultDashboard },
      data() {
        return {
          currentRole: 'EditorDashboard'
        }
      },
      computed: {
        ...mapGetters([
          'name',
          'avatar',
          'email',
          'introduction',
          'roles'
        ])
      },
      created() {
        if (this.roles.indexOf('admin') >= 0) {
          return;
        }
        // const isEditor = this.roles.some(v => v.indexOf('editor') >= 0)
        // if (!isEditor) {
        //   this.currentRole = 'DefaultDashboard';
        // }
        this.currentRole = 'DefaultDashboard';
      }
    }
</script>
