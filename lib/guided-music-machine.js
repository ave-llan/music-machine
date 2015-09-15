// var plusIntervalInKey = require('./plus-interval-in-key.js')
var Key = require('nmusic').Key

/**
 * step-by-step construction of music from a predefined Music Machine
 * @constructor
 *
 * @param {GuidedDecisionGraph} guide - a Guided Decision Graph. See:
 * [GuidedDecisionGraph]{https://github.com/jrleszcz/grammar-graph/blob/master/api.md#GuidedDecisionGraph}
 * @param {Key} [key='C major'] - the key in which to apply the generic interval.
 * See [Key]{@link https://github.com/jrleszcz/nmusic/blob/master/api.md#Key}
 * @param {number[]} [initialScaleDegrees=[1]] - the scale degree(s) which
 * constructions can start on
 */
var GuidedMusicMachine = function (guide, key, initialScaleDegrees) {
  key = key || new Key('C', 'major')
  initialScaleDegrees = initialScaleDegrees || [1]
  var construction = []  // chosen pitches

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return construction
  }

  /**
   * the tonic note of this key
   * @ returns {string} a pitch class string
   */
  this.tonic = function () {
    return key.tonic.pitchClass()
  }

  /**
   * is the current construction a valid, complete construction from the starting
   * nonterminal? ie, does the construction end in epsilon?
   * @returns {boolean} is the construction complete
   */
  this.isComplete = function () {
    return guide.isComplete()
  }

  this.choose = function (note) {
    var interval = Pitch(note).intervalSize()
  }

  this.choices = function (nDeep) {
    // special case if construcion is empty -- return only pitch classes
    if (construction.length === 0) {
      return initialScaleDegrees.map(function (scaleDegree) {
        return key.pitchAtDegree(scaleDegree).pitchClass()
      })
    }
    var previousNote = construction[construction.length - 1]
    return guide.choices().map(function (intervalSize) {
      return key.plusInterval(previousNote, intervalSize)
    })
  }
}

module.exports = GuidedMusicMachine
