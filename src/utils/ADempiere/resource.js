// This file allows generate util functions for handle arrays, resources and all
// related to upload to server side and downdload from server side to client side.
// Please add the necessary functions here:

// Merge two arrays and return merged array
export function mergeByteArray(currentArray, arrayToMerge) {
  const mergedArray = new currentArray.constructor(currentArray.length + arrayToMerge.length)
  mergedArray.set(currentArray)
  mergedArray.set(arrayToMerge, currentArray.length)
  return mergedArray
}

// Build a base 64 image from array
export function buildImageFromArray({
  contentType = 'image/*',
  bytesArray
}) {
  const binary = bytesArray.reduce((data, byte) => {
    return data + String.fromCharCode(byte)
  }, '')
  const b64encoded = btoa(binary)
  const buffer = 'data:' + contentType + ';base64,' + b64encoded
  return buffer
}

/**
 * Build a base 64 image from arrayBuffer
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {array} arrayBuffer
 * @param {string} contentType
 * @returns {string} image as base64 encoded
 */
export function buildImageFromArrayBuffer({
  arrayBuffer,
  contentType = 'image/*'
}) {
  const bytesArray = new Uint8Array(arrayBuffer)
  return buildImageFromArray({
    bytesArray,
    contentType
  })
}

/**
 * Get path to get file
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {object} url, urn and uri with path to request
 */
export function getImagePath({
  file,
  width = 300,
  height = 300,
  operation = 'fit'
}) {
  // TODO: Evaluate path url 'http://domain:port/adempiere-api', 'adempiere-api' is part of urn
  const config = require('../../../config/config.json')
  const url = config.adempiereStore.images.protocol + config.adempiereStore.images.baseUrl + config.adempiereStore.images.port + config.service
  const urn = `/img?action=${operation}&width=${width}&height=${height}&url=${file}`
  const uri = `${url}${urn}`

  return {
    url,
    urn,
    uri
  }
}
