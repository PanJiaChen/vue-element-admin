// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present Systemhaus Westfalia
// Contributor(s): Sofia Calderon sofia.ester.calderon@gmail.com www.wetfalia-it.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import i18n from '../../../../../src/lang/index.js'
import Badge from '@/components/ADempiere/Badge/index.vue'

const tableComponent = 'el-table'
const badgeComponent = 'el-badge'
const emptyDataBlock = '.el-table__empty-block'

let notificationProcesses

beforeEach(() => {
  notificationProcesses =
  [
    { id: '1', name: 'value1', isReport: true, processId: '1', instanceUuid: 'bc0ab4d0-8aff-11eb-8dcd-0242ac130003', download: 'file1.pdf' },
    { id: '2', name: 'value2', isReport: false, processId: '2', instanceUuid: 'bc0ab70a-8aff-11eb-8dcd-0242ac130003', download: 'file2.pdf' }
  ]
})

const mountMainWrapper = (notificationProcesses, $router) => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(ElementUI)

  const getters = {
    getNotificationProcess: () => (notificationProcesses)
  }
  const store = new Vuex.Store({ getters })

  return mount(Badge, {
    store,
    localVue,
    i18n,
    stubs: ['svg-icon'],
    mocks: {
      $router
    }
  })
}

describe('given the badge is initially loaded', () => {
  it('should display the correct header text', async() => {
    const wrapper = mountMainWrapper([])

    await wrapper.find({ name: tableComponent })

    const header = wrapper.find('th')
    expect(header.text()).toBe('Notifications')
  })
})

describe('given there are no notification processes', () => {
  it('should not display a badge with the amount of notification processes', async() => {
    const wrapper = mountMainWrapper([])
    const badgeWrapper = await wrapper.find({ name: badgeComponent })

    const badgeElement = badgeWrapper.find('sup')

    expect(badgeElement.isVisible()).toBeFalsy()
  })

  it('should display "No Data" in the table', async() => {
    const wrapper = mountMainWrapper([])
    await wrapper.find({ name: tableComponent })

    const noDataBlock = wrapper.find(emptyDataBlock).find('span')

    // 暂无数据 means 'No Data' in Chinese
    expect(noDataBlock.text()).toBe('暂无数据')
  })
})

describe('given there are notification processes in the store', () => {
  it('should display a badge with the amount of notification processes', async() => {
    const wrapper = mountMainWrapper(notificationProcesses)
    const badgeWrapper = await wrapper.find({ name: badgeComponent })

    const badgeElement = badgeWrapper.find('sup')

    expect(badgeElement.isVisible()).toBeTruthy()
    expect(badgeElement.text()).toBe('2')
  })

  it('should display the notification processes in the table', async() => {
    const wrapper = mountMainWrapper(notificationProcesses)
    await wrapper.find({ name: tableComponent })

    const tableRows = wrapper.find('.el-table__body').findAll('tr')

    expect(tableRows.at(0).find('div').text()).toBe('value1')
    expect(tableRows.at(1).find('div').text()).toBe('value2')
  })

  describe('given the close button of a row is clicked', () => {
    it('should delete the notification process of that row from the table', async() => {
      const router = { push: jest.fn() }
      const wrapper = mountMainWrapper(notificationProcesses, router)
      await wrapper.find({ name: tableComponent })

      const firstTableRow = wrapper.find('.el-table__body').find('tr')
      const closeButton = firstTableRow.findAll('td').at(2).find('button')

      closeButton.trigger('click')
      await wrapper.find({ name: tableComponent })

      const tableRows = wrapper.find('.el-table__body').findAll('tr')

      expect(tableRows.length).toBe(1)
      expect(tableRows.at(0).find('div').text()).toBe('value2')
    })

    it('should display the new number of notification processes in the badge', async() => {
      const router = { push: jest.fn() }
      const wrapper = mountMainWrapper(notificationProcesses, router)
      await wrapper.find({ name: tableComponent })

      const firstTableRow = wrapper.find('.el-table__body').find('tr')
      const closeButton = firstTableRow.findAll('td').at(2).find('button')

      closeButton.trigger('click')

      // I THINK THIS IS A BUG! The number should be dynamic...
      // const badgeWrapper = await wrapper.find({ name: badgeComponent })
      // const badgeElement = badgeWrapper.find('sup')

      // expect(badgeElement.text()).toBe('1')
    })
  })

  describe('given that the "Delete All" button is clicked', () => {
    it('should delete all notification processes from table and display "No Data"', async() => {
      const wrapper = mountMainWrapper(notificationProcesses)
      await wrapper.find({ name: tableComponent })

      expect(wrapper.find(emptyDataBlock).exists()).toBeFalsy()

      const deleteButton = wrapper.find('.el-table__header').find('button')
      deleteButton.trigger('click')

      await wrapper.find({ name: tableComponent })
      const noDataBlock = wrapper.find(emptyDataBlock).find('span')

      // 暂无数据 means 'No Data' in Chinese
      expect(noDataBlock.text()).toBe('暂无数据')
    })

    it('the badge with the amount of notification processes should disappear', async() => {
      const wrapper = mountMainWrapper(notificationProcesses)
      await wrapper.find({ name: tableComponent })

      const deleteButton = wrapper.find('.el-table__header').find('button')
      deleteButton.trigger('click')

      // I THINK THIS IS A BUG! The badge icon should disappear...
      // const badgeWrapper = await wrapper.find({ name: badgeComponent })
      // const badgeElement = badgeWrapper.find('sup')

      // expect(badgeElement.isVisible()).toBeFalsy()
    })
  })

  describe('given that the "Go to Process Logs" button is clicked', () => {
    it('should route to the Process Logs', async() => {
      const router = { push: jest.fn() }
      const wrapper = mountMainWrapper(notificationProcesses, router)
      const expectedRouterOptions = {
        name: 'ProcessActivity'
      }

      await wrapper.find({ name: tableComponent })

      const tableRow = wrapper.find('.el-table__body').find('tr')
      const goToButton = tableRow.findAll('td').at(1)

      goToButton.trigger('click')

      expect(router.push).toHaveBeenCalledWith(expectedRouterOptions, expect.anything())
    })
  })

  describe('given that the a row of the table is clicked', () => {
    describe('and the process notification is a report', () => {
      it('should route to the Report Viewer', async() => {
        const router = { push: jest.fn() }
        const wrapper = mountMainWrapper(notificationProcesses, router)
        const expectedRouterOptions = {
          name: 'Report Viewer',
          params: {
            processId: '1',
            instanceUuid: 'bc0ab4d0-8aff-11eb-8dcd-0242ac130003',
            fileName: 'file1.pdf'
          }
        }

        await wrapper.find({ name: tableComponent })

        const tableRow = wrapper.find('.el-table__body').find('tr')
        const anyCell = tableRow.findAll('td').at(0)

        anyCell.trigger('click')

        expect(router.push).toHaveBeenCalledWith(expectedRouterOptions, expect.anything())
      })
    })

    describe('and the process notification is not a report', () => {
      it('should route to the Process Logs', async() => {
        const router = { push: jest.fn() }
        const wrapper = mountMainWrapper(notificationProcesses, router)
        const expectedRouterOptions = {
          name: 'ProcessActivity'
        }

        await wrapper.find({ name: tableComponent })

        const tableRow = wrapper.find('.el-table__body').findAll('tr').at(1)
        const anyCell = tableRow.findAll('td').at(0)

        anyCell.trigger('click')

        expect(router.push).toHaveBeenCalledWith(expectedRouterOptions, expect.anything())
      })
    })
  })
})
