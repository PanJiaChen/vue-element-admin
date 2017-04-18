<template>
    <div class="dashboard-editor-container">
        <div class=" clearfix">
            <PanThumb style="float: left" :image="avatar"> 你的权限:
                <span class="pan-info-roles" v-for="item in roles">{{item}}</span>
            </PanThumb>
            <div class="info-container">
                <span class="display_name">{{name}}</span>
                <span style='font-size:20px;padding-top:20px;display:inline-block;'>赶紧把你们想要的快捷键报给产品锦鲤!</span>
            </div>
        </div>
        <div>
            <img class='emptyGif' :src="emptyGif" >
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import PanThumb from 'components/PanThumb';
    import emptyGif from 'assets/gifs/business_fella.gif';
    export default {
      name: 'dashboard-default',
      components: { PanThumb },
      data() {
        return {
          emptyGif
        }
      },
      computed: {
        ...mapGetters([
          'name',
          'avatar',
          'email',
          'uid',
          'introduction',
          'roles'
        ])
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .emptyGif {
       display: block;
       width: 45%;
       margin: 0 auto;
    }
    .dashboard-editor-container {
        background-color: #e3e3e3;
        min-height: 100vh;
        margin-top: -50px;
        padding: 100px 60px 0px;
        .pan-info-roles {
            font-size: 12px;
            font-weight: 700;
            color: #333;
            display: block;
        }
        .info-container {
            position: relative;
            margin-left: 190px;
            height: 150px;
            line-height: 200px;
            .display_name {
                font-size: 48px;
                line-height: 48px;
                color: #212121;
                position: absolute;
                top: 25px;
            }
        }
    }
</style>
