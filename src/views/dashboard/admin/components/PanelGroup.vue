<template>
  <div>
    <el-row :gutter="50" class="panel-group">
      <el-col :lg="24" class="card-panel-col">
        <el-card class="box-card" style="background-color:#d9e8fb">
          <el-tabs type="border-card" style="margin-top:-10px;">
            <el-tab-pane label="教务通知">
              <div v-for="o in 20" :key="o" class="text item separatorLine">
                <a href="www.baidu.com">{{ '列表内容 ' + o }}</a>
                <span style="float:right">2018-11-22</span>
                <span style="color: #a7a7a7;float:right; margin-right:20px;">[ 其他 ]</span>
              </div>
              <div class="pagination-container" style="margin-top:10px;">
                <el-pagination :current-page="1" :page-sizes="[10,20,30, 50]" :page-size="1" :total="20" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
              </div>
            </el-tab-pane>
            <el-tab-pane is-dot label="办事指南（教师）">配置管理</el-tab-pane>
            <el-tab-pane label="文件下载（学生）">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
          <el-tabs type="border-card" style="margin-top:20px;">
            <el-tab-pane label="教师通知">
              <div v-for="o in 20" :key="o" class="text item separatorLine">
                <a href="www.baidu.com">{{ '列表内容 ' + o }}</a>
                <span style="float:right">2018-11-22</span>
                <span v-if="o != 10 " style="color: #a7a7a7;float:right; margin-right:20px;">[ 张三 - 其他 ]</span>
                <span v-if="o === 10 " style="color: #a7a7a7;float:right; margin-right:20px;">[ 张三1234 - 其他 ]</span>
              </div>
              <div class="pagination-container" style="margin-top:10px;">
                <el-pagination :current-page="1" :page-sizes="[10,20,30, 50]" :page-size="1" :total="20" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-tabs type="border-card" style="margin-top:20px;">
            <el-tab-pane name="more" class="more-btn">
              <span slot="label">
                <el-badge is-dot class="item">教务通知</el-badge>
              </span>
              测试
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('purchases')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">天气预报</div>
            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('shoppings')">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="shoppingCard" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">新闻</div>
            <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix panel-group">
            <span>最新公告</span>
            <a href="#/example/list">
            <el-button style="float: right; padding: 3px 0" type="text">更多...</el-button></a>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            <a href="#/example/list">{{ '列表内容afassdfsaffsdf列表内容列表内容列表内容列表内容列表内容列表内容 ' + o }}</a>[17/08/29]
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix panel-group">
            <span>资源管理</span>
            <el-button style="float: right; padding: 3px 0" type="text">更多...</el-button>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            <a href="www.baidu.com">{{ '列表内容 ' + o }}</a>[17/08/29]
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text {
    font-size: 15px;
  }
a{color:#333;text-decoration:none;}
a:hover{ color:#C81F1A; text-decoration:none;}
  .item {
    margin-bottom: 10px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.card-header {
  font-family: STKaiti;
  font-size: 20px;
  padding: 5px 0px;
  color: #333;
}
.separatorLine {
    /* clear: both; */
    /* height: 1px; */
    padding-bottom: 2px;
    margin-left: 20px;
    margin-right: 20px;
    border-width: 1px;
    border-style: dashed;
    border-color: #34bfa3;
    border-top: 0;
    font-size: 14px;
    font-family: "microsoft yahei", arial, sans-serif;
    border-left: none;
    border-right: 0;
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
