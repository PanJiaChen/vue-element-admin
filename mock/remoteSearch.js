import Mock from 'mockjs'

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }))
}
NameList.push({ name: 'mockPan' })

export default {
  '/search/user': config => {
    const { name } = config.query
    const mockNameList = NameList.filter(item => {
      const lowerCaseName = item.name.toLowerCase()
      return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
    })
    return { items: mockNameList }
  }
}
