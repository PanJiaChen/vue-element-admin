import Mock from 'mockjs'

const List = []
const count = 3
const Random = Mock.Random
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@id',
    timestamp: +Mock.Random.date('T'),
    name1: Random.ctitle(2, 4), // 班级名称
    school: Random.ctitle(2, 4) + '小学', // 所在学校
    name: Random.date('yyyy') + '级' + Random.integer(1, 20) + '班'// 年级+班级
  }))
}

const stuList = []
for (let i = 0; i < 40; i++) {
  stuList.push(Mock.mock({
    id: '@id',
    timestamp: +Mock.Random.date('T'),
    name: '@cname', // 名字
    city: '@city',
    address: '@province' + '@city' + '@county',
    tel: /^1[385][1-9]\d{8}/,
    school: Random.ctitle(2, 4) + '小学', // 所在学校
    grade: Random.date('yyyy') + '级' + Random.integer(1, 20) + '班'// 年级+班级
  }))
}

export default {
  getClassList: () => {
    return {
      total: List.length,
      result: List
    }
  },
  fetchStuList: () => {
    return {
      total: stuList.length,
      result: stuList
    }
  }
}
