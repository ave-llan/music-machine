var Pitch = require('nmusic').Pitch

/**
 * helper function to sort an array of pitches from lowest to highest
 * @param {string[]} pitches - an array of pitch strings
 * @returns {string[]} a new clone of the provided pitch string
 * array sorted from low pitch to high pitch
 */
function sortPitches (pitches) {
  return pitches.map(Pitch).sort(function (a, b) {
    return a - b
  }).map(function (pitch) {
    return pitch.sciPitch()
  })
}

module.exports = sortPitches
