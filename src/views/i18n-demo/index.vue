<template>
  <div>
    <el-card class="box-card" style="margin-top:40px;">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="international" />
        <span style='margin-left:10px;'>{{$t('i18nView.title')}}</span>
      </div>
      <div>
        <el-radio-group v-model="lang" size="small">
          <el-radio label="zh" border>简体中文</el-radio>
          <el-radio label="en" border>English</el-radio>
        </el-radio-group>
        <el-tag style='margin-top:15px;display:block;' type="info">{{$t('i18nView.note')}}</el-tag>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin:100px 15px 50px;">
      <el-col :span="12">
        <div class="block">
          <el-date-picker v-model="date" type="date" :placeholder="$t('i18nView.datePlaceholder')"></el-date-picker>
        </div>
        <div class="block">
          <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next"
            :total="400">
          </el-pagination>
        </div>
        <div class="block">
          <el-button class="item-btn" size="small">{{$t('i18nView.default')}}</el-button>
          <el-button class="item-btn" size="small" type="primary">{{$t('i18nView.primary')}}</el-button>
          <el-button class="item-btn" size="small" type="success">{{$t('i18nView.success')}}</el-button>
          <el-button class="item-btn" size="small" type="info">{{$t('i18nView.info')}}</el-button>
          <el-button class="item-btn" size="small" type="warning">{{$t('i18nView.warning')}}</el-button>
          <el-button class="item-btn" size="small" type="danger">{{$t('i18nView.danger')}}</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-table :data="tableData" fit highlight-current-row border style="width: 100%">
          <el-table-column prop="name" :label="$t('i18nView.tableName')" width="100" align="center"></el-table-column>
          <el-table-column prop="date" :label="$t('i18nView.tableDate')" width="120" align="center"></el-table-column>
          <el-table-column prop="address" :label="$t('i18nView.tableAddress')"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import local from './local'
const viewName = 'i18nView'

export default {
  name: 'i18n',
  data() {
    return {
      date: '',
      currentPage: 5,
      tableData: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }]
    }
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[viewName]) {
      this.$i18n.mergeLocaleMessage('en', local.en)
      this.$i18n.mergeLocaleMessage('zh', local.zh)
    }
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.app.language
      },
      set(lang) {
        this.$i18n.locale = lang
        this.$store.dispatch('setLanguage', lang)
      }
    }
  }
}
</script>

<style scoped>
.box-card {
  width: 600px;
  margin: 20px auto;
}
.item-btn{
  margin-bottom: 15px;
  margin-left: 0px;
}
.block {
  padding: 25px;
}
</style>
