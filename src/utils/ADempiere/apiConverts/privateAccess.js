
export function convertPrivateAccess(privateAccessToConvert) {
  return {
    tableName: privateAccessToConvert.table_name,
    recordId: privateAccessToConvert.record_id,
    recordUuid: privateAccessToConvert.record_uuid
  }
}
