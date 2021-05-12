<template>
  <div>
    <el-row :gutter="24">
      <!-- ADempiere Vue -->
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div style="float: left;display: inline-flex;margin-top: 2%;">
              <span>
                <b> {{ RepositoryADVue.title }} </b>
              </span>
              <a target="_blank" :href="RepositoryADVue.href" style="margin-left: 5px;">
                <svg-icon icon-class="link" />
              </a>
            </div>
            <div style="float: right;display: inline-flex;">
              <el-popover
                placement="right"
                width="350"
                trigger="click"
                style="float: right"
              >
                <el-tabs v-model="activeName">
                  <el-tab-pane label="HTTPS" name="HTTPS">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositoryADVue.clone"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.clone)" />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="SSH" name="SSH">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositoryADVue.sshUrl"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.sshUrl)" />
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <el-button plain style="width: -webkit-fill-available;">
                  <a target="_blank" :href="RepositoryADVue.downloadZip">
                    <svg-icon icon-class="zip" /> {{ $t('documentation.downloadZip') }}
                  </a>
                </el-button>
                <el-button slot="reference" icon="el-icon-download" type="success" size="mini" plain>
                  {{ $t('documentation.code') }}
                </el-button>
              </el-popover>
              <el-button type="primary" size="mini" plain style="margin: 0px;padding-right: 3px;">
                <a target="_blank" :href="RepositoryADVue.href + '/branches'">
                  <svg-icon icon-class="tree-table" />  {{ $t('documentation.branches') }}
                </a>
              </el-button>
              <el-button type="warning" size="mini" plain style="margin: 0px;padding-right: 3px;">
                <a target="_blank" :href="RepositoryADVue.href + '/issues'">
                  <i class="el-icon-warning el-icon--right" />  {{ $t('documentation.issues') }}
                </a>
              </el-button>
            </div>
          </div>
          <div v-if="!isEmptyValue(RepositoryADVue)" style="display: inline-flex;width: 100%;">
            <img width="100" height="100" :src="RepositoryADVue.avatar" style="margin-left: 20%;">
            <p style="font-size: 30px;padding-top: 1%;color: #008fd3;"> {{ RepositoryADVue.title }} </p>
          </div>
          <p align="center">
            <tags />
          </p>
          <div v-if="!isEmptyValue(RepositoryADVue)" id="markdown" v-markdown="RepositoryADVue.description" />
          <el-collapse accordion>
            <el-collapse-item name="1">
              <template slot="title" style="font-size: 16px;">
                <span style="font-size: 16px;font-weight: revert;">
                  <b> {{ releasesLabel }} </b>
                </span>
                <a target="_blank" :href="RepositoryADVue.href + '/releases'" style="font-size: 16px;font-weight: revert;padding-left: 1%">
                  <svg-icon icon-class="link" />
                </a>
              </template>
              <el-collapse
                v-model="activeListReleases"
                accordion
              >
                <el-collapse-item
                  v-for="(releases, key) in releasesListADVue"
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
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <!-- ADempiere Proxy -->
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div style="float: left;display: inline-flex;margin-top: 2%;">
              <span>
                <b> {{ RepositoryProxyApi.title }} </b>
              </span>
              <a target="_blank" :href="RepositoryProxyApi.href" style="margin-left: 5px;">
                <svg-icon icon-class="link" />
              </a>
            </div>
            <div style="float: right;display: inline-flex;">
              <el-popover
                placement="right"
                width="350"
                trigger="click"
                style="float: right"
              >
                <el-tabs v-model="activeName">
                  <el-tab-pane label="HTTPS" name="HTTPS">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositoryProxyApi.clone"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.clone)" />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="SSH" name="SSH">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositoryProxyApi.sshUrl"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.sshUrl)" />
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <el-button plain style="width: -webkit-fill-available;">
                  <a target="_blank" :href="RepositoryProxyApi.downloadZip">
                    <svg-icon icon-class="zip" /> {{ $t('documentation.downloadZip') }}
                  </a>
                </el-button>
                <el-button slot="reference" icon="el-icon-download" type="success" size="mini" plain>{{ $t('documentation.code') }}</el-button>
              </el-popover>
              <el-button type="primary" size="mini" plain>
                <a target="_blank" :href="RepositoryProxyApi.href + '/branches'">
                  <svg-icon icon-class="tree-table" />  {{ $t('documentation.branches') }}
                </a>
              </el-button>
              <el-button type="warning" size="mini" plain style="margin: 0px;padding-right: 3px;">
                <a target="_blank" :href="RepositoryProxyApi.href + '/issues'">
                  <i class="el-icon-warning el-icon--right" />  {{ $t('documentation.issues') }}
                </a>
              </el-button>
            </div>
          </div>
          <div v-if="!isEmptyValue(RepositoryProxyApi)" style="display: inline-flex;width: 100%;">
            <img width="100" height="100" :src="RepositoryProxyApi.avatar" style="margin-left: 20%;">
            <p style="font-size: 30px;padding-top: 1%;color: #008fd3;"> {{ RepositoryProxyApi.title }} </p>
          </div>
          <p align="center">
            <tags />
          </p>
          <div v-if="!isEmptyValue(RepositoryProxyApi)" id="markdown" v-markdown="RepositoryProxyApi.description" />
          <el-collapse accordion>
            <el-collapse-item name="1">
              <template slot="title" style="font-size: 16px;">
                <span style="font-size: 16px;font-weight: revert;">
                  <b> {{ releasesLabel }} </b>
                </span>
                <a target="_blank" :href="RepositoryProxyApi.href + '/releases'" style="font-size: 16px;font-weight: revert;padding-left: 1%">
                  <svg-icon icon-class="link" />
                </a>
              </template>
              <el-collapse
                v-model="activeListReleases"
                accordion
              >
                <el-collapse-item
                  v-for="(releases, key) in releasesListProxyApi"
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
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <!-- ADempiere gRPC -->
      <el-col :span="defaultSize" :style="style">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div style="float: left;display: inline-flex;margin-top: 2%;">
              <span>
                <b> {{ RepositorygRPC.title }} </b>
              </span>
              <a target="_blank" :href="RepositorygRPC.href" style="margin-left: 5px;">
                <svg-icon icon-class="link" />
              </a>
            </div>
            <div style="float: right;display: inline-flex;">
              <el-popover
                placement="right"
                width="350"
                trigger="click"
                style="float: right"
              >
                <el-tabs v-model="activeName">
                  <el-tab-pane label="HTTPS" name="HTTPS">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositorygRPC.clone"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.clone)" />
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="SSH" name="SSH">
                    <div style="display: flex;">
                      <el-input
                        v-model="RepositorygRPC.sshUrl"
                        :disabled="true"
                      />
                      <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(RepositoryProxyApi.sshUrl)" />
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <el-button plain style="width: -webkit-fill-available;">
                  <a target="_blank" :href="RepositorygRPC.downloadZip" style="width: -webkit-fill-available; display: table;">
                    <svg-icon icon-class="zip" /> {{ $t('documentation.downloadZip') }}
                  </a>
                </el-button>
                <el-button slot="reference" icon="el-icon-download" type="success" size="mini" plain>{{ $t('documentation.code') }}</el-button>
              </el-popover>
              <el-button type="primary" size="mini" plain>
                <a target="_blank" :href="RepositorygRPC.href + '/branches'">
                  <svg-icon icon-class="tree-table" />  {{ $t('documentation.branches') }}
                </a>
              </el-button>
              <el-button type="warning" size="mini" plain style="margin: 0px;padding-right: 3px;">
                <a target="_blank" :href="RepositorygRPC.href + '/issues'">
                  <i class="el-icon-warning el-icon--right" />  {{ $t('documentation.issues') }}
                </a>
              </el-button>
            </div>
          </div>
          <div>
            <div v-if="!isEmptyValue(RepositorygRPC)" style="display: inline-flex;width: 100%;">
              <img width="100" height="100" :src="RepositorygRPC.avatar" style="margin-left: 20%;">
              <p style="font-size: 30px;padding-top: 1%;color: #008fd3;"> {{ RepositorygRPC.title }} </p>
            </div>

            <p align="center">
              <tags />
            </p>
            <div v-if="!isEmptyValue(RepositorygRPC)" id="markdown" v-markdown="RepositorygRPC.description" />
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template slot="title" style="font-size: 16px;">
                  <span style="font-size: 16px;font-weight: revert;">
                    <b> {{ releasesLabel }} </b>
                  </span>
                  <a target="_blank" :href="RepositorygRPC.href + '/releases'" style="font-size: 16px;font-weight: revert;padding-left: 1%">
                    <svg-icon icon-class="link" />
                  </a>
                </template>
                <el-collapse
                  v-model="activeListReleases"
                  accordion
                >
                  <el-collapse-item
                    v-for="(releases, key) in releasesListgRPC"
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
                    <div v-if="!isEmptyValue(releases.body)" id="markdown" v-markdown="releases.body" />
                  </el-collapse-item>
                </el-collapse>
              </el-collapse-item>
            </el-collapse>
          </div>
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
      activeName: 'HTTPS',
      icon: 'M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z',
      releaseNotes: {
        body: ''
      },
      releasesLabel: this.$t('documentation.releases'),
      proxyDocument: {},
      RepositoryADVue: {},
      RepositoryProxyApi: {},
      RepositorygRPC: {},
      RepositoryADVueSite: {},
      releasesListADVue: [],
      releasesListProxyApi: [],
      releasesListgRPC: []
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
      return this.releasesListADVue.length - 1
    },
    activeListReleases() {
      const active = this.releasesListADVue.findIndex(releases => this.releaseNotes.title === releases.title)
      return active
    },
    linkReleases() {
      return this.RepositoryADVue.href + '/releases'
    }
  },
  created() {
    this.loadReleasesList()
  },
  methods: {
    // ADempiere Vue
    fetchRepositoryADVue() {
      fetchReadme({
        repository: 'adempiere-vue'
      })
        .then(response => {
          this.RepositoryADVue = {
            title: response.name,
            href: response.html_url,
            description: response.description,
            avatar: response.organization.avatar_url,
            clone: response.clone_url,
            sshUrl: response.ssh_url,
            branches: response.branches_url,
            downloadZip: response.html_url + '/archive/refs/heads/' + response.default_branch + '.zip'
          }
        })
    },
    fechReleases() {
      fetchReleasesList({
        repository: '/adempiere-vue'
      })
        .then(response => {
          if (response) {
            response.forEach(release => {
              this.releasesListADVue.push({
                title: release.name,
                href: release.html_url,
                author: release.author.login,
                body: release.body,
                created_at: release.created_at,
                download: release.assets[0].browser_download_url,
                titleDownload: release.assets[0].name
              })
            })
            if (config.repository.releaseNo !== undefined && this.releasesListADVue.length > 0) {
              this.releaseNotes = this.releasesListADVue.find(release => {
                return release.title === config.repository.releaseNo
              })
              if (!this.releaseNotes) {
                this.releaseNotes = this.releasesListADVue[0]
              }
            }
          }
        })
    },
    // Proxy Adempiere Api
    fetchRepositoryProxy() {
      fetchReadme({
        repository: 'proxy-adempiere-api'
      })
        .then(response => {
          this.RepositoryProxyApi = {
            title: response.name,
            href: response.html_url,
            description: response.description,
            avatar: response.organization.avatar_url,
            clone: response.clone_url,
            sshUrl: response.ssh_url,
            branches: response.branches_url,
            downloadZip: response.html_url + '/archive/refs/heads/' + response.default_branch + '.zip'
          }
        })
    },
    fechReleasesProxy() {
      fetchReleasesList({
        repository: '/proxy-adempiere-api'
      })
        .then(response => {
          if (response) {
            response.forEach(release => {
              this.releasesListProxyApi.push({
                title: release.name,
                href: release.html_url,
                author: release.author.login,
                body: release.body,
                created_at: release.created_at,
                download: this.isEmptyValue(release.assets) ? release.assets : release.assets[0].browser_download_url,
                titleDownload: this.isEmptyValue(release.assets) ? release.assets : release.assets[0].name
              })
            })
            if (config.repository.releaseNo !== undefined && this.releasesListProxyApi.length > 0) {
              this.releaseNotes = this.releasesListProxyApi.find(release => {
                return release.title === config.repository.releaseNo
              })
              if (!this.releaseNotes) {
                this.releaseNotes = this.releasesListProxyApi[0]
              }
            }
          }
        })
    },
    // Adempiere gRPC Server
    fetchRepositoryGRPC() {
      fetchReadme({
        repository: 'adempiere-gRPC-Server'
      })
        .then(response => {
          this.RepositorygRPC = {
            title: response.name,
            href: response.html_url,
            description: response.description,
            avatar: response.organization.avatar_url,
            clone: response.clone_url,
            sshUrl: response.ssh_url,
            branches: response.branches_url,
            downloadZip: response.html_url + '/archive/refs/heads/' + response.default_branch + '.zip'
          }
        })
    },
    fechReleasesgRPC() {
      fetchReleasesList({
        repository: '/adempiere-gRPC-Server'
      })
        .then(response => {
          if (response) {
            response.forEach(release => {
              this.releasesListgRPC.push({
                title: this.isEmptyValue(release.name) ? release.tag_name : release.name,
                href: release.html_url,
                author: release.author.login,
                body: release.body,
                created_at: release.created_at,
                download: release.assets[0].browser_download_url,
                titleDownload: release.assets[0].name
              })
            })
            if (config.repository.releaseNo !== undefined && this.releasesListgRPC.length > 0) {
              this.releaseNotes = this.releasesListgRPC.find(release => {
                return release.title === config.repository.releaseNo
              })
              if (!this.releaseNotes) {
                this.releaseNotes = this.releasesListgRPC[0]
              }
            }
          }
        })
    },
    // load
    loadReleasesList() {
      // Repository
      this.fetchRepositoryADVue()
      this.fetchRepositoryProxy()
      this.fetchRepositoryGRPC()
      // Releases
      this.fechReleases()
      this.fechReleasesProxy()
      this.fechReleasesgRPC()
    },
    // fallback Copy Text To Clip board
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (document.execCommand('copy')) {
          this.clipboardMessage(this.$t('notifications.copySuccessful'))
        }
      } catch (err) {
        this.clipboardMessage(this.$t('notifications.copyUnsuccessful'))
      }
      document.body.removeChild(textArea)
    },
    // Notification Message when Copying TextNotification Message when Copying Text
    clipboardMessage(message) {
      this.$message({
        message: message,
        type: 'success',
        showClose: true,
        duration: 1500
      })
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
