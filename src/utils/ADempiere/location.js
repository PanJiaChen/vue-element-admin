// This file can be used for all related to location util like capture sequence and others values.
// Please add here all locations util methods

// Use this function for get a list of sequence of capture for locations
export function getSequenceAsList(captureSequence) {
  if (!captureSequence) {
    return undefined
  }
  //  Split it
  return captureSequence
    .replace('@@', '@')
    .replace(',', '')
    .trim()
    .split('@')
    .filter(value => value.trim())
}
