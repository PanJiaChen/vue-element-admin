import Mock from 'mockjs';


const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@cname',
    auditor: '@cname',
    title: '@ctitle(10, 20)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['FD', 'FE', 'BI', 'VN'],
    'status|1': ['published', 'draft', 'deleted'],
    pageviews: '@integer(300, 5000)'
  }));
}

export default {
  getList: config => {
    const { importance, type, title, page, limit } = config.params;
    const mockList = List.filter(item => {
      if (importance && item.importance !== importance) return false;
      if (type && item.type !== type) return false;
      if (title && item.title.indexOf(title) < 0) return false;
      return true;
    });
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([200, {
          total: mockList.length,
          items: pageList
        }]);
      }, 100);
    })
  },
  getPv: () => new Promise(resolve => {
    setTimeout(() => {
      resolve([200, {
        pvData: [{ key: 'PC网站', pv: 1024 }, { key: 'mobile网站', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
      }]);
    }, 100);
  })
};
