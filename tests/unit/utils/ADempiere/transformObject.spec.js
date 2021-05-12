const { camelizeObjectKeys, renameObjectKey } = require('@/utils/ADempiere/transformObject')

describe('given an object is camelized', () => {
  it('should camelize all snake case object entries', () => {
    const obj = {
      'menu_uuid': '95326d2a-a67b-11eb-bcbc-0242ac130002',
      'menu_name': 'Menu Name'
    }
    const convertedObj = camelizeObjectKeys(obj)

    expect(convertedObj.menuUuid).toBe('95326d2a-a67b-11eb-bcbc-0242ac130002')
    expect(convertedObj.menuName).toBe('Menu Name')
    expect(convertedObj.menu_uuid).toBeUndefined()
    expect(convertedObj.menu_name).toBeUndefined()
  })

  it('should ignore all entires that are not snake case', () => {
    const obj = {
      'menu_name': 'Menu Name',
      'menuItem': 'Menu Item',
      'something': 'else'
    }
    const convertedObj = camelizeObjectKeys(obj)

    expect(convertedObj.menuName).toBe('Menu Name')
    expect(convertedObj.menuItem).toBe('Menu Item')
    expect(convertedObj.something).toBe('else')
  })

  it('should return empty object if object is empty', () => {
    const obj = {}
    const convertedObj = camelizeObjectKeys(obj)

    expect(convertedObj).toBeDefined()
  })
})

describe('given an object key is renamed', () => {
  it('should only rename the passed key', () => {
    const obj = {
      'key1': 'value for key',
      'permanentKey': 'permanent value'
    }
    renameObjectKey(obj, 'key1', 'key2')

    expect(obj.key2).toBe('value for key')
    expect(obj.permanentKey).toBe('permanent value')
    expect(obj.key1).toBeUndefined()
  })

  it('should not change anything if old key does not exist', () => {
    const obj = {
      'key1': 'key1 value',
      'key2': 'key2 value'
    }
    renameObjectKey(obj, 'key3', 'key4')

    expect(obj.key1).toBe('key1 value')
    expect(obj.key2).toBe('key2 value')
    expect(obj.key4).toBeUndefined()
  })

  it('should rename if new key already exists in object', () => {
    const obj = {
      'key1': 'key1 value',
      'key2': 'key2 value'
    }
    renameObjectKey(obj, 'key1', 'key2')

    expect(obj.key1).toBeUndefined()
    expect(obj.key2).toBe('key1 value')
  })
})
