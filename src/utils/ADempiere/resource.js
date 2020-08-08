// This file allows generate util functions for handle arrays, resources and all related to upload to server side
// and downdload from server side to client side. Please add the necessary functions here:

// Merge two arrays and return merged array
export function mergeByteArray(currentArray, arrayToMerge) {
  const mergedArray = new currentArray.constructor(currentArray.length + arrayToMerge.length)
  mergedArray.set(currentArray)
  mergedArray.set(arrayToMerge, currentArray.length)
  return mergedArray
}

// Build a base 64 image from array
export function buildImageFromArray(resource, byteArray) {
  return 'data:' + resource.contentType + ';base64,' + btoa(
    byteArray.reduce(
      (data, byte) => data + String.fromCharCode(byte), ''
    )
  )
}
