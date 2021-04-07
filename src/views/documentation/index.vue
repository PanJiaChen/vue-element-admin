<template>
  <div>
    <el-row>
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <b> {{ $t('documentation.documentation') }} </b>
            </span>
            <a target="_blank" :href="readmeDocument.href">
              <svg-icon icon-class="link" />
            </a>
          </div>
          <div>
            <div v-if="!isEmptyValue(readmeDocument)" style="display: inline-flex;width: 100%;">
              <img width="100" height="100" :src="readmeDocument.avatar" style="margin-left: 20%;">
              <p style="font-size: 30px;padding-top: 1%;color: #008fd3;"> {{ readmeDocument.title }} </p>
            </div>

            <p align="center">
              <tags />
            </p>
            <div v-if="!isEmptyValue(readmeDocument)" id="markdown" v-markdown="readmeDocument.description" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <b> {{ $t('documentation.github') }} </b>
            </span>
            <a target="_blank" :href="readmeRepositoryGithub.href">
              <svg-icon icon-class="link" />
            </a>
          </div>
          <div v-if="!isEmptyValue(readmeRepositoryGithub)" style="display: inline-flex;width: 100%;">
            <img width="100" height="100" :src="readmeRepositoryGithub.avatar" style="margin-left: 20%;">
            <p style="font-size: 30px;padding-top: 1%;color: #008fd3;"> {{ readmeRepositoryGithub.title }} </p>
          </div>
          <p align="center">
            <tags />
          </p>
          <div v-if="!isEmptyValue(readmeRepositoryGithub)" id="markdown" v-markdown="readmeRepositoryGithub.description" />
        </el-card>
      </el-col>
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <b> {{ releasesLabel }} </b>
            </span>
            <a target="_blank" :href="releases">
              <svg-icon icon-class="link" />
            </a>
          </div>
          <el-collapse
            v-model="activeListReleases"
            accordion
          >
            <el-collapse-item
              v-for="(releases, key) in releasesList"
              :key="key"
              :name="key"
            >
              <template slot="title">
                <svg v-if="key !== stopper" class="octicon octicon-tag" viewBox="0 0 16 16" version="1.1" width="16" height="16" style="margin-right: 2%;">
                  <path fill-rule="evenodd" :d="icon" />
                </svg>
                <b>
                  {{
                    releases.title
                  }}
                </b>
              </template>
              <el-button type="text" style="float: right;">
                <a target="_blank" :href="releases.download">
                  {{ releases.titleDownload }} <i class="el-icon-download" />
                </a>
              </el-button>
              <div v-if="!isEmptyValue(releases)" id="markdown" v-markdown="releases.body" />
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchReleasesList, fetchReadme } from '@/api/documentation/documentation'
import { config } from '@/utils/ADempiere/config'
import tags from './tags'

export default {
  name: 'Documentation',
  components: { tags },
  data() {
    return {
      releasesList: [],
      activeNames: ['1'],
      icon: 'M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z',
      releaseNotes: {
        body: ''
      },
      releases: 'https://github.com/adempiere/adempiere-vue/releases',
      releasesLabel: this.$t('documentation.releases'),
      readmeRepositoryGithub: {},
      readmeDocument: {}
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    defaultSize() {
      if (this.isMobile) {
        return 24
      }
      return 8
    },
    style() {
      return 'margin-top: 2%;padding: 0.5%;'
    },
    stopper() {
      return this.releasesList.length - 1
    },
    activeListReleases() {
      const active = this.releasesList.findIndex(releases => this.releaseNotes.title === releases.title)
      return active
    }
  },
  created() {
    this.loadReleasesList()
  },
  methods: {
    fetchDocument() {
      fetchReadme({
        repository: 'adempiere-vue-site'
      })
        .then(response => {
          this.readmeDocument = {
            title: response.name,
            href: response.html_url,
            description: response.description,
            avatar: response.organization.avatar_url
          }
        })
    },
    fetchRepository() {
      fetchReadme({
        repository: 'adempiere-vue'
      })
        .then(response => {
          this.readmeRepositoryGithub = {
            title: response.name,
            href: response.html_url,
            description: response.description,
            avatar: response.organization.avatar_url
          }
        })
    },
    fechReleases() {
      fetchReleasesList()
        .then(response => {
          if (response) {
            response.forEach(release => {
              this.releasesList.push({
                title: release.name,
                href: release.html_url,
                author: release.author.login,
                body: release.body,
                created_at: release.created_at,
                download: release.assets[0].browser_download_url,
                titleDownload: release.assets[0].name
              })
            })
            if (config.repository.releaseNo !== undefined && this.releasesList.length > 0) {
              this.releaseNotes = this.releasesList.find(release => {
                return release.title === config.repository.releaseNo
              })
              if (!this.releaseNotes) {
                this.releaseNotes = this.releasesList[0]
              }
            }
          }
        })
    },
    loadReleasesList() {
      this.fetchDocument()
      this.fetchRepository()
      this.fechReleases()
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {
  margin: 50px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .document-btn {
    flex-shrink: 0;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    padding: 0 16px;
    margin: 16px;
    line-height: 60px;
    font-size: 20px;
    text-align: center;
  }
  .el-col {
    margin-top: 2%;
    padding: 1%;
  }
  .a {
    background-color: transparent;
    float: right;
    padding: 3px 0px;
  }
}
</style>
