import Mock from 'mockjs'

const count = 20

export default {
  '/transaction/list': {
    total: count,
    [`items|${count}`]: [{
      order_no: '@guid()',
      timestamp: +Mock.Random.date('T'),
      username: '@name()',
      price: '@float(1000, 15000, 0, 2)',
      'status|1': ['success', 'pending']
    }]
  }
}
