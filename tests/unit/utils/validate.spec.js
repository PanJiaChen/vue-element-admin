import { validUsername, validateURL, validateLowerCase, validateUpperCase, validateAlphabets } from '@/utils/validate.js'
describe('Utils:validate', () => {
  it('validUsername', () => {
    expect(validUsername('admin')).toBe(true)
    expect(validUsername('editor')).toBe(true)
    expect(validUsername('xxxx')).toBe(false)
  })
  it('validateURL', () => {
    expect(validateURL('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(validateURL('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(validateURL('github.com/PanJiaChen/vue-element-admin')).toBe(false)
  })
  it('validateLowerCase', () => {
    expect(validateLowerCase('abc')).toBe(true)
    expect(validateLowerCase('Abc')).toBe(false)
    expect(validateLowerCase('123abc')).toBe(false)
  })
  it('validateUpperCase', () => {
    expect(validateUpperCase('ABC')).toBe(true)
    expect(validateUpperCase('Abc')).toBe(false)
    expect(validateUpperCase('123ABC')).toBe(false)
  })
  it('validateAlphabets', () => {
    expect(validateAlphabets('ABC')).toBe(true)
    expect(validateAlphabets('Abc')).toBe(true)
    expect(validateAlphabets('123aBC')).toBe(false)
  })
})
