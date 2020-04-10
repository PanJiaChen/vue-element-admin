import { param2Obj } from '@/utils/index.js'
describe('Utils:param2Obj', () => {
  const url = 'https://github.com/PanJiaChen/vue-element-admin?name=bill&age=29&sex=1&field=dGVzdA=='

  it('param2Obj', () => {
    expect(param2Obj(url)).toEqual({
      name: 'bill',
      age: '29',
      sex: '1',
      field: window.btoa('test')
    })
  })
})
