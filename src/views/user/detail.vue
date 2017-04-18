<template>
    <div class="fedUser-detail-container" v-loading="!fetchSuccess">
        <div v-if="fetchSuccess" class="top-container clearfix">
            <el-col :span="5">
                <img class="info-avatar" :src="userInfo.base_info.image">
            </el-col>
            <el-col :span="16" :offset="2">
                <div class="info-item">
                    <span class="info-label">用户名</span>
                    <span class="info-text">{{userInfo.base_info.username}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">昵称</span>
                    <span class="info-text">{{userInfo.base_info.display_name}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">手机号</span>
                    <span class="info-text">{{userInfo.base_info.mobile}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">余额</span>
                    <span class="info-text">{{userInfo.banance}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">ios余额</span>
                    <span class="info-text">{{userInfo.ios_banance}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">注册日期</span>
                    <span class="info-text">{{userInfo.created_at | parseTime('{y}-{m}-{d} {h}:{i}')}} 注册渠道:{{userInfo.signup_method}}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">最后登录</span>
                    <span class="info-text">{{userInfo.last_signin_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                </div>
            </el-col>
        </div>


        <el-tabs v-if="fetchSuccess" v-model="activeTab">

            <el-tab-pane label="基本信息" name="info">
                <Info :info="userInfo"></Info>
            </el-tab-pane>

            <el-tab-pane label="评论记录" name="information">
                <Comment :user_id="userInfo.uid"></Comment>
            </el-tab-pane>

            <!--<el-tab-pane label="消费记录" name="stream">

            </el-tab-pane>-->

        </el-tabs>
    </div>
</template>

<script>
    import { userInfo } from 'api/user';
    import Info from './components/info';
    import Comment from '../comment/commentsList'

    export default {
      name: 'fedUser-detail',
      components: { Info, Comment },
      data() {
        return {
          userInfo: {},
          activeTab: 'info',
          fetchSuccess: false
        }
      },
      created() {
        this.fetchData();
      },
      methods: {
        fetchData() {
          userInfo(this.$route.params.id).then(response => {
            this.userInfo = response.data;
            this.fetchSuccess = true;
          }).catch(err => {
            this.fetchSuccess = true;
            console.log(err);
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .fedUser-detail-container {
        padding: 30px;
        .top-container {
            margin-bottom: 30px;
            .info-item {
                line-height: 14px;
                padding-bottom: 18px;
                .info-label {
                    display: inline-block;
                    color: #1f2f3d;
                    font-size: 16px;
                    position: absolute;
                }
                .info-text {
                    margin-left: 120px;
                    font-size: 14px;
                    color: #5e6d82;
                }
            }

        }
        .info-avatar {
            width: 200px;
            height: 200px;
            border-radius: 100%;
        }

    }
</style>
