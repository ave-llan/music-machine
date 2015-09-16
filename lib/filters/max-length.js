/**
 * returns a filter that restricts the maximum length of the construction
 * @param {number} max - the maximum length (inclusive) of the
 *                             desired construction
 * @returns {filter} a filter that limits the length of the construction
 */

function maxLength (max) {
  return function (choices, construction) {
    return (construction.length < max) ? choices
                                             : []
  }
}

module.exports = maxLength
