const { convertFieldGroup, convertField } = require('@/utils/ADempiere/apiConverts/field')
import fieldGroup from './objects/fromApi/fieldGroup.json'
import convertedFieldGroup from './objects/converted/fieldGroup.json'
import field from './objects/fromApi/field.json'
import convertedField from './objects/converted/field.json'

describe('field group', () => {
  it('should return a converted field group object', () => {
    const actualFieldGroup = convertFieldGroup(fieldGroup)
    expect(actualFieldGroup).toEqual(convertedFieldGroup)
  })
})

describe('field', () => {
  it('should return a converted field object', () => {
    const actualField = convertField(field)
    expect(actualField).toEqual(convertedField)
  })
})
