/**
 * Order State
 * @author Elsio Sanchez <elsiosanches@gmail.com>
 */
const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}
export default {
  order: {
    documentType: {},
    documentStatus: {
      value: ''
    },
    totalLines: 0,
    grandTotal: 0,
    salesRepresentative: {},
    businessPartner: {
      value: '',
      uuid: ''
    }
  },
  findOrder: {},
  listOrder: {
    ...withoutResponse,
    isShowPopover: false
  }
}
