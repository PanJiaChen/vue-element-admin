const Promise = require('bluebird')

/**
 *  Creates a promise that is resolved when all input promises have been
 *  settled.  The returned Promise is resolved with an array of
 *  Promise.Inspection objects.
 *
 *  This is the commonly accepted way of implementing allSettled() in Bluebird.
 *  See:  http://bluebirdjs.com/docs/api/reflect.html
 *
 * @param promises - The array of input promises.
 * @returns {Promise<Promise.Inspection[]>} A promise that will be resolved once
 * all input Promises have settled. The returned Promise will be resolved with a
 * corresponding array of Promise.Inspection objects.
 */
function allSettled(promises) {
  'use strict'
  const wrappedPromises = promises.map((curPromise) => curPromise.reflect())
  return Promise.all(wrappedPromises)
}

module.exports = {
  allSettled: allSettled
}
