var intervalSize = require('nmusic').intervalSize
var sortPitches = require('../utils/sort-pitches.js')

/**
 * filter generator that returns a filter which restricts the maximum
 *                             range of the construction
 * @param {number} maxIntervalSize - the maximum range (inclusive) of the
 *                             desired construction
 * @returns {filter} a filter that limits the range of the construction
 */
function maxRange (maxIntervalSize) {
  return function (choices, construction) {
    if (construction.length === 0) return choices // no need to check if not begun
    var usedNotes = sortPitches(construction)
    var lowNote = usedNotes[0]
    var hiNote = usedNotes[usedNotes.length - 1]
    return choices.filter(function (pitch) {
      return intervalSize(lowNote, pitch) <= maxIntervalSize &&
             intervalSize(hiNote, pitch) <= maxIntervalSize
    })
  }
}

module.exports = maxRange
