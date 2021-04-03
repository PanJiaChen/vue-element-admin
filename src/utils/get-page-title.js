import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // return `${pageTitle} - ${title}` 网站页面标签
    return `${pageTitle}`
  }
  return `${title}`
}
