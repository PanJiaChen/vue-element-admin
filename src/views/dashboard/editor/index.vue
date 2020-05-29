<template>
  <div class="dashboard-editor-container">
    <div class=" clearfix">
      <pan-thumb :image="avatar" style="float: left;">
        Your roles:
        <span v-for="item in roles" :key="item" class="pan-info-roles">{{ item }}</span>
      </pan-thumb>
      <github-corner style=" border: 0;position: absolute; right: 0; top: 0;" />
      <div class="info-container">
        <span class="display-name">{{ name }}</span>
        <span style="display: inline-block;font-size: 20px;padding-top: 20px;">Editor's Dashboard</span>
      </div>
    </div>
    <div>
      <img :src="emptyGif" class="empty-gif">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import GithubCorner from '@/components/GithubCorner'

export default {
  name: 'DashboardEditor',
  components: { PanThumb, GithubCorner },
  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .empty-gif {
    display: block;
    margin: 0 auto;
    width: 45%;
  }

  .dashboard-editor-container {
    background-color: #e3e3e3;
    min-height: 100vh;
    padding: 50px 60px 0;

    .pan-info-roles {
      color: #333;
      display: block;
      font-size: 12px;
      font-weight: 700;
    }

    .info-container {
      height: 150px;
      line-height: 200px;
      margin-left: 190px;
      position: relative;

      .display-name {
        color: #212121;
        font-size: 48px;
        line-height: 48px;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
