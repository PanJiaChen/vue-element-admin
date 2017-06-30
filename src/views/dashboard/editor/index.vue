<template>
    <div class="dashboard-editor-container">
        <a href="https://github.com/PanJiaChen/vue-element-admin" target="_blank" class="github-corner" aria-label="View source on Github">
            <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#4AB7BD; color:#fff; position: absolute; top: 50px; border: 0; right: 0;"
                aria-hidden="true">
                <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                    fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
                <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                    fill="currentColor" class="octo-body"></path>
            </svg>
        </a>
        <div class="btn-group">
            <el-row>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn blue-btn" to="/components/index">Components</router-link>
                </el-col>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn light-blue-btn" to="/charts/index">Charts</router-link>
                </el-col>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn pink-btn" to="/excel/download">Export Excel</router-link>
                </el-col>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn green-btn" to="/example/table/table">Table</router-link>
                </el-col>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn tiffany-btn" to="/example/form/edit">Form</router-link>
                </el-col>
                <el-col :span="4" class='text-center'>
                    <router-link class="pan-btn yellow-btn" to="/example/form/edit">Theme</router-link>
                </el-col>
            </el-row>

        </div>
        <el-row>
            <el-col :span="6">

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <pan-thumb style="float: left" :image="avatar"> 你的权限:
                            <span class="pan-info-roles" v-for="item in roles">{{item}}</span>
                        </pan-thumb>
                    </div>
                    <span class="display_name">{{name}}</span>
                    <div class="info-item" :to="'/article/wscnlist?uid='+uid">
                        <countTo class="info-item-num" :startVal='0' :endVal='statisticsData.article_count' :duration='3400'></countTo>
                        <span class="info-item-text">文章</span>
                        <wscn-icon-svg icon-class="a" class="dashboard-editor-icon" />
                    </div>
                    <div class="info-item" style="cursor: auto">
                        <countTo class="info-item-num" :startVal='0' :endVal='statisticsData.pageviews_count' :duration='3600'></countTo>
                        <span class="info-item-text">浏览量</span>
                        <wscn-icon-svg icon-class="b" class="dashboard-editor-icon" />
                    </div>
                    <div class="info-item" :to="'/comment/commentslist?res_author_id='+uid">
                        <countTo class="info-item-num" ref='countTo3' :startVal='0' :endVal='statisticsData.comment_count' :duration='3800'></countTo>
                        <span class="info-item-text">评论</span>
                        <wscn-icon-svg icon-class="c" class="dashboard-editor-icon" />
                    </div>

                </el-card>

            </el-col>
            <el-col :span="8">
                <pie-chart></pie-chart>
            </el-col>

            <el-col :span="10">
                <bar-chart></bar-chart>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="16">
                <line-chart></line-chart>
            </el-col>
        </el-row>

        <div class="info-container">

            <div class="info-wrapper">

            </div>
        </div>

        <!--<div class="clearfix main-dashboard-container">

            <div class="recent-articles-container">
                <div class="recent-articles-title">最近撸了</div>
                <div class="recent-articles-wrapper">
                    <template v-if="recentArticles.length!=0">
                        <div class="recent-articles-item" v-for="item in  recentArticles">
                            <span class="recent-articles-status">{{item.status | statusFilter}}</span>
                             <span class="recent-articles-content" :to="'/article/edit/'+item.id">
                                {{item.title}}
                            </span>
                            <span class="recent-articles-time">{{item.author}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="recent-articles-emptyTitle">你太懒了最近都没有撸</div>
                    </template>
                </div>
            </div>
        </div>-->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import PanThumb from 'components/PanThumb';
    import pieChart from './pieChart';
    import barChart from './barChart';
    import lineChart from './lineChart';
    import { getList } from 'api/article';
    import countTo from 'vue-count-to';
    export default {
      name: 'dashboard-editor',
      components: { PanThumb, countTo, pieChart, lineChart, barChart },
      data() {
        return {
          chart: null,
          statisticsData: {
            article_count: 1024,
            comment_count: 102400,
            latest_article: [],
            month_article_count: 28,
            pageviews_count: 1024,
            week_article: [
               { count: 30, week: '201716' },
                { count: 26, week: '201715' },
                { count: 31, week: '201714' },
                { count: 28, week: '201713' },
                { count: 40, week: '201712' },
                { count: 41, week: '201711' },
                { count: 50, week: '201710' },
                { count: 42, week: '201709' },
                { count: 36, week: '201708' },
                { count: 32, week: '201707' },
                { count: 40, week: '201706' },
                { count: 41, week: '201705' }
            ]
          },
          list: []
        }
      },
      created() {
        this.fetchData();
      },
      computed: {
        ...mapGetters([
          'name',
          'avatar',
          'email',
          'uid',
          'introduction',
          'roles'
        ]),
        recentArticles() {
          return this.list.slice(0, 7)
        }
      },
      methods: {
        fetchData() {
          getList(this.listQuery).then(response => {
            this.list = response.data;
          })
        }
      },
      filters: {
        statusFilter(status) {
          const statusMap = {
            published: '已发布',
            draft: '草稿中',
            deleted: '已删除'
          };
          return statusMap[status];
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container{
    margin: 30px;
}
</style>
