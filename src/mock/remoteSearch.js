import Mock from 'mockjs';

const NameList = [];
const count = 100;

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'
  }));
}
NameList.push({ name: 'mockPan' })

export default {
  searchUser: config => {
    const { name } = config.params;
    const mockNameList = NameList.filter(item => {
      const lowerCaseName = item.name.toLowerCase()
      if (name && lowerCaseName.indexOf(name.toLowerCase()) < 0) return false;
      return true;
    });
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([200, {
          items: mockNameList
        }]);
      }, 100);
    })
  }
};
