// Service for get ADempiere Vue releases from repo.
// Add here any service related with it
import request from '@/utils/request'
import { config } from '@/utils/ADempiere/config'

// Fetch releases from repository
export function fetchReleasesList() {
  return request({
    baseURL: config.repository.url,
    url: '/repos/adempiere/adempiere-vue/releases',
    method: 'get',
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
}
