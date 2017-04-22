import Mock from 'mockjs';


const List = [];
const count = 50;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@cname',
    title: '@ctitle(10, 20)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'calendar_type|1': ['FD', 'FE', 'BI', 'VN'],
    'status|1': ['published', 'draft', 'deleted']
  }));
}

export default {
  getList: config =>
    // let {page, sortWay, startTime, endTime, userName, age} = config.params;
    // let mockUsers = _Users.filter(user => {
    //   if (startTime && user.date < startTime) return false;
    //   if (endTime && user.date > endTime) return false;
    //   if (userName && user.name !== userName) return false;
    //   if (age && user.age !== age) return false;
    //   return true;
    // });
    // if (sortWay) {
    //   let {order, prop} = sortWay;
    //   mockUsers = mockUsers.sort((u1, u2) => order === 'ascending' ? u1[prop] - u2[prop] : u2[prop] - u1[prop]);
    // }
    // if (page === 0) page++;
    // mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
     new Promise(resolve => {
       setTimeout(() => {
         resolve([200, {
           total: List.length,
           items: List
         }]);
       }, 100);
     })

};
