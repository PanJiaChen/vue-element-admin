import Mock from 'mockjs';
Mock.mock(/\/article\/list/, {
  'data|20': [{
    id: '@id',
    title: '@ctitle(10, 20)',
    author: '@cname',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

export default Mock;
