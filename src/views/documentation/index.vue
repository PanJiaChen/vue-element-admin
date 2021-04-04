<template>
  <div class="app-container documentation-container">
    <a class="document-btn" target="_blank" href="https://adempiere.github.io/adempiere-vue-site/">{{ $t('documentation.documentation') }}</a>
    <a class="document-btn" target="_blank" href="https://github.com/adempiere/adempiere-vue">{{ $t('documentation.github') }}</a>
    <dropdown-menu class="document-btn" :items="releasesList" :title="releasesLabel" />
    <div id="markdown" v-markdown="releaseNotes.body" />
  </div>
</template>

<script>
import DropdownMenu from '@/components/Share/DropdownMenu'
import { fetchReleasesList } from '@/api/documentation/releases'
import { config } from '@/utils/ADempiere/config'

export default {
  name: 'Documentation',
  components: { DropdownMenu },
  data() {
    return {
      releasesList: [],
      releaseNotes: {
        body: ''
      },
      releasesLabel: this.$t('documentation.releases')
    }
  },
  created() {
    this.loadReleasesList()
  },
  methods: {
    loadReleasesList() {
      fetchReleasesList()
        .then(response => {
          if (response) {
            response.forEach(release => {
              this.releasesList.push({
                title: release.name,
                href: release.html_url,
                author: release.author.login,
                body: release.body,
                created_at: release.created_at
              })
            })
            if (config.repository.releaseNo !== undefined && this.releasesList.length > 0) {
              this.releaseNotes = this.releasesList.find(release => {
                return release.title === config.repository.releaseNo
              })
              if (!this.releaseNotes) {
                this.releaseNotes = ''
              }
            }
          }
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
}
</style>
