<template>
  <el-card class="box-card-component" style="margin-left: 8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div style="position: relative;">
      <pan-thumb :image="avatar" class="pan-thumb" />
      <mallki class-name="mallki-text" text="vue-element-admin" />
      <div style="padding-top: 35px;" class="progress-item">
        <span>Vue</span>
        <el-progress :percentage="70" />
      </div>
      <div class="progress-item">
        <span>JavaScript</span>
        <el-progress :percentage="18" />
      </div>
      <div class="progress-item">
        <span>Css</span>
        <el-progress :percentage="12" />
      </div>
      <div class="progress-item">
        <span>ESLint</span>
        <el-progress :percentage="100" status="success" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
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

<style lang="scss" >
.box-card-component {
  .el-card__header {
    padding: 0 !important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    height: 220px;
    position: relative;

    img {
      height: 100%;
      transition: all 0.2s linear;
      width: 100%;

      &:hover {
        filter: contrast(130%);
        transform: scale(1.1, 1.1);
      }
    }
  }

  .mallki-text {
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    right: 0;
    top: 0;
  }

  .pan-thumb {
    background-color: #fff;
    border: 5px solid #fff;
    box-shadow: none !important;
    height: 70px !important;
    left: 0;
    margin: auto;
    position: absolute !important;
    top: -45px;
    width: 70px !important;
    z-index: 100;

    /deep/ .pan-info {
      box-shadow: none !important;
    }
  }

  .progress-item {
    font-size: 14px;
    margin-bottom: 10px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
