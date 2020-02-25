import { getLanguage } from '@/lang/index'
import { getToken } from '@/utils/auth'
import Dictionary from '@adempiere/grpc-dictionary-client'
import { DICTIONARY_ADDRESS } from '@/api/ADempiere/constants'

// Get Instance for connection
function Instance() {
  return new Dictionary(
    DICTIONARY_ADDRESS,
    getToken(),
    getLanguage() || 'en_US'
  )
}

export function getWindow(uuid, childrenTabs = true) {
  return Instance.call(this).requestWindow({
    uuid: uuid,
    isWithTabs: childrenTabs,
    isConvertedMetadata: true
  })
}

export function getProcess(uuid, isConvert = true) {
  return Instance.call(this).requestProcess({
    uuid: uuid,
    isConvertedMetadata: isConvert,
    isConvertedFields: true
  })
}

export function getBrowser(uuid, isConvert = true) {
  return Instance.call(this).requestBrowser({
    uuid,
    isConvertedMetadata: isConvert,
    isConvertedFields: true
  })
}

export function getTab(uuid, childrenFields = true, isConvert = true) {
  return Instance.call(this).requestTab({
    uuid,
    isWithFields: childrenFields,
    isConvertedMetadata: isConvert,
    isConvertedFields: true
  })
}

export function getField(uuid) {
  return Instance.call(this).requestField(uuid)
}
