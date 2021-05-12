import {
  convertReference,
  convertReferencesList
} from '@/utils/ADempiere/apiConverts/values'
import reference from './objects/fromApi/reference.json'
import convertedReference from './objects/converted/reference.json'
import referenceList from './objects/fromApi/referenceList.json'
import convertedReferenceList from './objects/converted/referenceList.json'

describe('reference', () => {
  it('should return a converted reference object', () => {
    const actualReference = convertReference(reference)
    expect(actualReference).toEqual(convertedReference)
  })
})

describe('referenceList', () => {
  it('should return a converted referenceList object', () => {
    const actualReferenceList = convertReferencesList(referenceList)
    expect(actualReferenceList).toEqual(convertedReferenceList)
  })
})
