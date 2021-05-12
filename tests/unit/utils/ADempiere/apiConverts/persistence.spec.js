import { convertEntity, convertEntityList, convertTranslation } from '@/utils/ADempiere/apiConverts/persistence'
import entityList from './objects/fromApi/entityList.json'
import convertedEntityList from './objects/converted/entityList.json'
import entity from './objects/fromApi/entity.json'
import convertedEntity from './objects/converted/entity.json'
import translation from './objects/fromApi/translation.json'
import convertedTranslation from './objects/converted/translation.json'

describe('entity list', () => {
  it('should return a converted entity list object', () => {
    const actualEntityList = convertEntityList(entityList)
    expect(actualEntityList).toEqual(convertedEntityList)
  })
})

describe('entity', () => {
  it('should return a converted entity object', () => {
    const actualEntity = convertEntity(entity)
    expect(actualEntity).toEqual(convertedEntity)
  })
})

describe('translation', () => {
  it('should return a converted translation object', () => {
    const actualTranslation = convertTranslation(translation)
    expect(actualTranslation).toEqual(convertedTranslation)
  })
})
