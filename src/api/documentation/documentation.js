// Service for get ADempiere Vue releases from repo.
// Add here any service related with it
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'
const baseURL = config.documentation.api.url
// Fetch releases from repository
export function fetchReleasesList() {
  return request({
    baseURL,
    url: '/adempiere-vue/releases',
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
}
// Fetch readme from repository
export function fetchReadme({
  repository
}) {
  return request({
    baseURL,
    url: repository,
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
}
