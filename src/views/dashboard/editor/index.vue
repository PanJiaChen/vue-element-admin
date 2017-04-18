<template>
    <div class="dashboard-editor-container">
        <div class=" clearfix">
            <PanThumb style="float: left" :image="avatar"> 你的权限:
                <span class="pan-info-roles" v-for="item in roles">{{item}}</span>
            </PanThumb>
            <div class="info-container">
                <span class="display_name">{{name}}</span>
                <div class="info-wrapper">
                    <router-link class="info-item" :to="'/article/wscnlist?uid='+uid">
                        <span class="info-item-num">{{statisticsData.article_count | toThousandslsFilter}}</span>
                        <span class="info-item-text">文章</span>
                        <wscn-icon-svg icon-class="a" class="dashboard-editor-icon"/>
                    </router-link>
                    <div class="info-item" style="cursor: auto">
                        <span class="info-item-num"> {{statisticsData.pageviews_count | toThousandslsFilter}}</span>
                        <span class="info-item-text">浏览量</span>
                        <wscn-icon-svg icon-class="b" class="dashboard-editor-icon"/>
                    </div>
                    <router-link class="info-item" :to="'/comment/commentslist?res_author_id='+uid">
                        <span class="info-item-num">{{statisticsData.comment_count | toThousandslsFilter}}</span>
                        <span class="info-item-text">评论</span>
                        <wscn-icon-svg icon-class="c" class="dashboard-editor-icon"/>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="btn-group">
            <router-link class="pan-btn blue-btn" to="/article/create">发表文章</router-link>
            <router-link class="pan-btn light-blue-btn" to="/livenews/create">发布快讯</router-link>
            <router-link class="pan-btn red-btn" to="/push/create">推送</router-link>
            <router-link class="pan-btn pink-btn" to="/comment/commentslist">评论管理</router-link>
            <router-link class="pan-btn green-btn" to="/article/wscnlist">文章列表</router-link>
            <router-link class="pan-btn tiffany-btn" to="/livenews/list">实时列表</router-link>
        </div>

        <div class="clearfix main-dashboard-container">
            <div class="chart-container">
                <MonthKpi style="border-bottom: 1px solid #DEE1E2;"
                          :articlesComplete='statisticsData.month_article_count'></MonthKpi>
                <ArticlesChart :listData='statisticsData.week_article'></ArticlesChart>
            </div>
            <div class="recent-articles-container">
                <div class="recent-articles-title">最近撸了</div>
                <div class="recent-articles-wrapper">
                    <template v-if="recentArticles.length!=0">
                        <div class="recent-articles-item" v-for="item in  recentArticles">
                            <span class="recent-articles-status">{{item.status | statusFilter}}</span>
                            <router-link class="recent-articles-content" :to="'/article/edit/'+item.id">
                                <span>{{item.title}}</span>
                            </router-link>
                            <span class="recent-articles-time"><i style="padding-right: 4px;" class="el-icon-time"></i>{{item.display_time | parseTime('{m}-{d} {h}:{i}')}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="recent-articles-emptyTitle">你太懒了最近都没有撸</div>
                        <!--<img class="emptyGif" :src="emptyGif">-->
                    </template>
                </div>
                <router-link class="recent-articles-more" :to="'/article/wscnlist?uid='+uid">
                    Show more
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import PanThumb from 'components/PanThumb';
    import MonthKpi from './monthKpi';
    import ArticlesChart from './articlesChart';
    // import { getStatistics } from 'api/article';

    import emptyGif from 'assets/compbig.gif';
    export default {
      name: 'dashboard-editor',
      components: { PanThumb, MonthKpi, ArticlesChart },
      data() {
        return {
          chart: null,
          statisticsData: {
            article_count: undefined,
            comment_count: undefined,
            latest_article: [],
            month_article_count: undefined,
            pageviews_count: undefined,
            week_article: []
          },
          emptyGif
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
          return this.statisticsData.latest_article.slice(0, 7)
        }
      },
      methods: {
        fetchData() {
        //   getStatistics().then(response => {
        //     this.statisticsData = response.data;
        //     this.statisticsData.week_article = this.statisticsData.week_article.slice().reverse();
        //   })
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
    .emptyGif {
        width: 100%;
        height: 100%;
    }

    .recent-articles-emptyTitle {
        font-size: 16px;
        color: #95A5A6;
        padding-top: 20px;
        text-align: center;
    }

    .dashboard-editor-container {
        padding: 30px 50px;
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
            .info-wrapper {
                line-height: 40px;
                position: absolute;
                bottom: 0px;
                .info-item {
                    cursor: pointer;
                    display: inline-block;
                    margin-right: 95px;
                    .info-item-num {
                        color: #212121;
                        font-size: 24px;
                        display: inline-block;
                        padding-right: 5px;
                    }
                    .info-item-text {
                        color: #727272;
                        font-size: 14px;
                        padding-right: 5px;
                        display: inline-block;
                    }
                }
            }
            .dashboard-editor-icon {
                width: 22px;
                height: 22px;
            }
        }

        .btn-group {
            margin: 30px 36px 30px 0;
        }
        .main-dashboard-container {
            width: 100%;
            position: relative;
            border: 1px solid #DEE1E2;
            padding: 0 10px;
        }
        .chart-container {
            float: left;
            position: relative;
            padding-right: 10px;
            width: 40%;
            border-right: 1px solid #DEE1E2;
        }
        .recent-articles-container {
            padding: 12px 12px 0px;
            float: left;
            width: 60%;
            position: relative;
            .recent-articles- {
                &title {
                    font-size: 16px;
                    color: #95A5A6;
                    letter-spacing: 1px;
                    padding-left: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #DEE1E2;
                }
                &more {
                    color: #2C3E50;
                    font-size: 12px;
                    float: right;
                    margin-right: 25px;
                    line-height: 40px;
                    &:hover {
                        color: #3A71A8;
                    }
                }
                &wrapper {
                    padding: 0 20px 0 22px;
                    .recent-articles- {
                        &item {
                            cursor: pointer;
                            padding: 16px 100px 16px 16px;
                            border-bottom: 1px solid #DEE1E2;
                            position: relative;
                            &:before {
                                content: "";
                                height: 104%;
                                width: 0px;
                                background: #30B08F;
                                display: inline-block;
                                position: absolute;
                                opacity: 0;
                                left: 0px;
                                top: -2px;
                                transition: 0.3s ease all;
                            }
                            &:hover {
                                &:before {
                                    opacity: 1;
                                    width: 3px;
                                }
                            }
                        }
                        &status {
                            font-size: 12px;
                            display: inline-block;
                            color: #9B9B9B;
                            padding-right: 6px;
                        }
                        &content {
                            font-size: 13px;
                            color: #2C3E50;
                            &:hover {
                                color: #3A71A8;
                            }
                        }
                        &time {
                            position: absolute;
                            right: 16px;
                            top: 16px;
                            color: #9B9B9B;
                        }
                    }
                }
            }

        }
    }
</style>
