import { formatTime } from '@/utils/index.js'
describe('Utils:formatTime', () => {
  const d = new Date('2018-07-13 17:54:01') // "2018-07-13 17:54:01"
  const retrofit = 5 * 1000

  it('ten digits timestamp', () => {
    expect(formatTime((d / 1000).toFixed(0))).toBe('7月13日17时54分')
  })
  it('test now', () => {
    expect(formatTime(+new Date() - 1)).toBe('刚刚')
  })
  it('less two minute', () => {
    expect(formatTime(+new Date() - 60 * 2 * 1000 + retrofit)).toBe('2分钟前')
  })
  it('less two hour', () => {
    expect(formatTime(+new Date() - 60 * 60 * 2 * 1000 + retrofit)).toBe('2小时前')
  })
  it('less one day', () => {
    expect(formatTime(+new Date() - 60 * 60 * 24 * 1 * 1000)).toBe('1天前')
  })
  it('more than one day', () => {
    expect(formatTime(d)).toBe('7月13日17时54分')
  })
  it('format', () => {
    expect(formatTime(d, '{y}-{m}-{d} {h}:{i}')).toBe('2018-07-13 17:54')
    expect(formatTime(d, '{y}-{m}-{d}')).toBe('2018-07-13')
    expect(formatTime(d, '{y}/{m}/{d} {h}-{i}')).toBe('2018/07/13 17-54')
  })
})
