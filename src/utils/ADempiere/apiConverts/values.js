
export function convertReferencesList(listReferencesToConvert) {
  return {
    recordCount: listReferencesToConvert.record_count,
    referencesList: listReferencesToConvert.records.map(record => {
      return convertReference(record)
    }),
    nextPageToken: listReferencesToConvert.next_page_token
  }
}

export function convertReference(referenceToConvert) {
  const { uuid } = referenceToConvert

  return {
    uuid,
    tableName: referenceToConvert.table_name,
    windowUuid: referenceToConvert.window_uuid,
    displayName: referenceToConvert.display_name,
    whereClause: referenceToConvert.where_clause,
    recordCount: referenceToConvert.record_count
  }
}
