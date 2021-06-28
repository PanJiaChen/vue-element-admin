
import { convertWindow } from '@/utils/ADempiere/apiConverts/dictionary.js'

export function generateWindow(windowResponse) {
  const responseWindow = convertWindow(windowResponse)

  const {
    tabsList, tabsListParent,
    firstTab, firstTabUuid
  } = generateTabs({
    tabs: responseWindow.tabs,
    windowUuid: responseWindow.uuid
  })

  const newWindow = {
    ...responseWindow,
    tabsList,
    currentTab: tabsListParent[0],
    tabsListParent,
    // app attributes
    currentTabUuid: tabsListParent[0].uuid,
    firstTab,
    firstTabUuid,
    // App properties
    isShowedTabsChildren: false,
    isShowedRecordNavigation: undefined,
    isShowedAdvancedQuery: false
  }

  return newWindow
}

export function generateTabs({
  tabs,
  windowUuid
}) {
  const firstTabTableName = tabs[0].tableName
  const firstTabUuid = tabs[0].uuid
  const tabsListParent = []

  // indexes related to visualization
  let tabParentIndex = 0

  const tabsList = tabs.filter((itemTab) => {
    return !(
      itemTab.isTranslationTab || itemTab.isSortTab ||
      itemTab.isAdvancedTab || itemTab.isHasTree
    )
  }).map((tabItem, index) => {
    // let tab = tabItem
    const tab = {
      ...tabItem,
      containerUuid: tabItem.uuid,
      parentUuid: windowUuid,
      windowUuid,
      tabGroup: tabItem.fieldGroup,
      firstTabUuid,
      // relations
      isParentTab: Boolean(firstTabTableName === tabItem.tableName),
      // app properties
      isShowedRecordNavigation: !(tabItem.isSingleRow),
      isLoadFieldsList: false,
      index // this index is not related to the index in which the tabs are displayed
    }

    if (tab.isParentTab) {
      tab.tabParentIndex = tabParentIndex
      tabParentIndex++
      tabsListParent.push(tab)
      return tab
    }
    return tab
  })

  return {
    firstTabUuid,
    firstTab: tabsList[0],
    tabsListParent,
    tabsList
  }
}
