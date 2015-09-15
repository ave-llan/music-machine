var Key = require('nmusic').Key

/**
 * helper function that finds the result of adding a generic interval to a given pitch
 * in the context of a key
 *
 * Optionally, exclude the intervalSize parameter and get back a curried function
 * with the key and startPitch set as defaults.
 *
 * @param {string} key - the key in which to apply the generic interval. Must be a valid
 * pitch string and mode name seperated by whitespace such as 'Bb major' or 'Db dorian'
 * @param {string} sciPitch - a pitch in scientific pitch notation.
 * @param {number} intervalSize - an interval string or number with or without quality.
 * If quality is not provided, accidentals on given pitch will be ignored.
 * @returns {String|Function} the resulting pitch string, or if given only one argument,
 * returns a function with the given argument set as a default.
 */
var plusIntervalInKey = function (key, startPitch, intervalSize) {
  var keyInfo = key.split(/\s+/)
  var keySignature = new Key(keyInfo[0], keyInfo[1])

  if (arguments.length === 2) {
    return function (intervalSize) {
      return keySignature.plusInterval(startPitch, intervalSize).sciPitch()
    }
  }
  return keySignature.plusInterval(startPitch, intervalSize).sciPitch()
}

module.exports = plusIntervalInKey
