var intervalQuality = require('nmusic').intervalQuality

var QUALITIES = 'MmPAd'       // chars that represent interval qualities

/**
 * filter generator that returns a filter which restricts the maximum
 *                             length of the construction
 * @param {...char} quality - characters representing quality.
 * 'm' = minor, 'M' = Major, 'P' = Perfect, 'd' = diminished, 'A' = augmented
 * @returns {filter} a filter that limits the length of the construction
 * @throws Will throw an error if an argument is not a valid quality character
 */
var allowedIntervalQualities = function () {
  // put all arguments into allowedQualities
  var allowedQualities = ''
  for (var i = 0; i < arguments.length; i++) {
    if (QUALITIES.indexOf(arguments[i]) === -1) {
      throw new Error('Not a valid quality char:', arguments[i])
    }
    allowedQualities += arguments[i]
  }

  return function (choices, construction) {
    if (construction.length === 0) return choices  // no intervals to check

    var previousNote = construction[construction.length - 1]

    return choices.filter(function (note) {
      return allowedQualities.indexOf(intervalQuality(previousNote, note)) !== -1
    })
  }
}

module.exports = allowedIntervalQualities
