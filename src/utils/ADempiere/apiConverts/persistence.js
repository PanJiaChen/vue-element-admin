import { convertArrayKeyValueToObject } from '@/utils/ADempiere/valueFormat.js'

export function convertEntityList(entityListToConvert) {
  return {
    nextPageToken: entityListToConvert.next_page_token,
    recordCount: entityListToConvert.record_count,
    recordsList: entityListToConvert.records.map(record => {
      return convertEntity(record)
    })
  }
}

export function convertEntity(entityToConvert) {
  return {
    id: entityToConvert.id,
    uuid: entityToConvert.uuid,
    tableName: entityToConvert.table_name,
    attributes: convertArrayKeyValueToObject({
      array: entityToConvert.attributes,
      keyName: 'key'
    })
  }
}

export function convertTranslation(translationToConvert) {
  return {
    language: translationToConvert.language,
    uuid: translationToConvert.uuid,
    values: translationToConvert.values
  }
}
