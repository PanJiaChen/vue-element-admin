import Mock from 'mockjs';
Mock.mock(/\/article\/list/, {
  'data|20': [{
    id: '@id',
    content: '@cparagraph',
    time: '@datetime'
  }]
})

export default Mock;
