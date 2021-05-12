export function camelizeObjectKeys(obj) {
  const camelizedObj = Object.assign({}, obj)
  Object.keys(camelizedObj).forEach(k => {
    const newK = k.replace(/(\_\w)/g, (m) => m[1].toUpperCase())
    if (newK !== k) {
      camelizedObj[newK] = camelizedObj[k]
      delete camelizedObj[k]
    }
  })
  return camelizedObj
}
export function renameObjectKey(obj, oldEntry, newEntry) {
  delete Object.assign(obj, { [newEntry]: obj[oldEntry] })[oldEntry]
}
