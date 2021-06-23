<template>
  <el-card v-if="isLoadedRepository" class="box-card">
    <div slot="header" class="clearfix">
      <div style="float: left; display: inline-flex; margin-top: 2%;">
        <span>
          <b> {{ repositoryData.title }} </b>
        </span>
        <el-tooltip class="item" effect="dark" :content="$t('documentation.goRepository')" placement="top-start">
          <a target="_blank" :href="repositoryData.href" style="margin-left: 5px;">
            <svg-icon icon-class="link" />
          </a>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" :content="$t('documentation.seeDocumentation')" placement="top-start">
          <a target="_blank" :href="repositoryData.document" style="margin-left: 5px;">
            <svg-icon icon-class="education" />
          </a>
        </el-tooltip>
      </div>

      <div style="float: right;display: inline-flex;">
        <el-popover
          placement="right"
          width="350"
          trigger="click"
          style="float: right"
        >
          <el-tabs v-model="tabSelected">
            <el-tab-pane label="HTTPS" name="https">
              <div style="display: flex;">
                <el-input
                  v-model="repositoryData.clone"
                  :disabled="true"
                />
                <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(repositoryData.clone)" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="SSH" name="ssh">
              <div style="display: flex;">
                <el-input
                  v-model="repositoryData.sshUrl"
                  :disabled="true"
                />
                <el-button icon="el-icon-copy-document" @click="fallbackCopyTextToClipboard(repositoryData.sshUrl)" />
              </div>
            </el-tab-pane>
          </el-tabs>

          <el-button plain style="width: -webkit-fill-available;">
            <a target="_blank" :href="repositoryData.downloadZip">
              <svg-icon icon-class="zip" />
              {{ $t('documentation.downloadZip') }}
            </a>
          </el-button>

          <el-button slot="reference" icon="el-icon-download" type="success" size="mini" plain>
            {{ $t('documentation.code') }}
          </el-button>
        </el-popover>

        <el-button type="primary" size="mini" plain style="margin: 0px; padding-right: 3px;">
          <a target="_blank" :href="repositoryData.href + '/branches'">
            <svg-icon icon-class="tree-table" />
            {{ $t('documentation.branches') }}
          </a>
        </el-button>
        <el-button type="warning" size="mini" plain style="margin: 0px; padding-right: 3px;">
          <a target="_blank" :href="repositoryData.href + '/issues'">
            <i class="el-icon-warning el-icon--right" />
            {{ $t('documentation.issues') }}
          </a>
        </el-button>
      </div>
    </div>

    <div v-if="!isEmptyValue(repositoryData)" style="display: inline-flex; width: 100%;">
      <img width="100" height="100" :src="repositoryData.avatar" style="margin-left: 20%;">
      <p style="font-size: 30px; padding-top: 1%; color: #008fd3;">
        {{ repositoryData.title }}
      </p>
    </div>
    <p align="center">
      <repository-tags :repository="repository" />
    </p>

    <div
      v-if="!isEmptyValue(repositoryData)"
      id="markdown"
      v-markdown="repositoryData.description"
    />

    <el-collapse accordion>
      <el-collapse-item name="1">
        <template slot="title" style="font-size: 16px;">
          <span style="font-size: 16px; font-weight: revert;">
            <b> {{ $t('documentation.releases') }} </b>
          </span>
          <a target="_blank" :href="repositoryData.href + '/releases'" style="font-size: 16px; font-weight: revert; padding-left: 1%">
            <svg-icon icon-class="link" />
          </a>
        </template>

        <el-collapse
          v-if="isLoadedReleases"
          v-model="releaseOpened"
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
              <b> {{ releases.title }} </b>
            </template>
            <el-button type="text" style="float: right;">
              <a target="_blank" :href="releases.download">
                {{ releases.titleDownload }}
                <i class="el-icon-download" />
              </a>
            </el-button>

            <div v-if="!isEmptyValue(releases)" id="markdown" v-markdown="releases.body" />
          </el-collapse-item>
        </el-collapse>

      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'

import { config } from '@/utils/ADempiere/config'
import RepositoryTags from './RepositoryTags'
import { fetchReleasesList, fetchReadme } from '@/api/documentation/documentation'

export default defineComponent({
  name: 'Repository-Documentation',

  components: {
    RepositoryTags
  },

  props: {
    repository: {
      type: String,
      required: true
    }
  },

  setup(props, { root }) {
    const isLoadedRepository = ref(false)
    const isLoadedReleases = ref(false)
    const repositoryData = ref({})
    const releasesList = ref([])
    const releaseNotes = ref({})
    const tabSelected = ref('https')
    const releaseOpened = ref([])
    const icon = 'M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z'

    const stopper = computed(() => {
      return releasesList.value.length - 1
    })

    // fallback Copy Text To Clip board
    const fallbackCopyTextToClipboard = (text) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (document.execCommand('copy')) {
          clipboardMessage(root.$t('notifications.copySuccessful'))
        }
      } catch (err) {
        clipboardMessage(root.$t('notifications.copyUnsuccessful'))
      }
      document.body.removeChild(textArea)
    }

    // Notification Message when Copying TextNotification Message when Copying Text
    const clipboardMessage = (message) => {
      root.$message({
        message,
        type: 'success',
        showClose: true,
        duration: 1500
      })
    }

    // Repository
    fetchReadme({
      repository: props.repository
    })
      .then(response => {
        repositoryData.value = {
          title: response.name,
          document: response.homepage,
          href: response.html_url,
          description: response.description,
          avatar: response.organization.avatar_url,
          clone: root.isEmptyValue(response.clone_url) ? '' : String(response.clone_url),
          sshUrl: root.isEmptyValue(response.ssh_url) ? '' : String(response.ssh_url),
          branches: response.branches_url,
          downloadZip: response.html_url + '/archive/refs/heads/' + response.default_branch + '.zip'
        }

        isLoadedRepository.value = true
      })

    // Releases
    fetchReleasesList({
      repository: '/' + props.repository
    })
      .then(response => {
        if (response) {
          response.forEach(release => {
            let download
            let titleDownload
            if (!root.isEmptyValue(release.assets)) {
              download = release.assets[0].browser_download_url
              titleDownload = release.assets[0].name
            }
            releasesList.value.push({
              title: release.name,
              href: release.html_url,
              author: release.author.login,
              body: root.isEmptyValue(release.body) ? '' : String(release.body),
              created_at: release.created_at,
              download,
              titleDownload
            })
          })

          const { releaseNo } = config.repository
          if (!root.isEmptyValue(releaseNo) && !root.isEmptyValue(releasesList.value)) {
            releaseNotes.value = releasesList.value.find(release => {
              return release.title === releaseNo
            })
            if (root.isEmptyValue(releaseNotes.value)) {
              releaseNotes.value = releasesList.value[0]
            }
          }

          isLoadedReleases.value = true
        }
      })

    return {
      icon,
      tabSelected,
      releaseOpened,
      isLoadedRepository,
      isLoadedReleases,
      repositoryData,
      releasesList,
      // computed
      stopper,
      // methods
      fallbackCopyTextToClipboard
    }
  }
})
</script>
