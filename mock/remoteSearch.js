import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mockPan' })

export default [
  {
    url: '/search/user',
    type: 'get',
    response: config => {
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return { items: mockNameList }
    }
  },
  {
    url: '/transaction/list',
    type: 'get',
    response: _ => {
      const count = 20
      return {
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
  }
]
