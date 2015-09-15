// var plusIntervalInKey = require('./plus-interval-in-key.js')
var Key = require('nmusic').Key
var Pitch = require('nmusic').Pitch
var clone = require('./utils/clone.js')

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

  // helper function to return the last note
  var lastNote = function () {
    return construction[construction.length - 1]
  }

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return clone(construction)
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

  /**
   * adds the given pitch to the construction
   * @param {string} pitch - a pitch string in the current set of next choices
   */
  this.choose = function (pitchChoice) {
    // special case if construcion is empty -- add note without choosing in guide
    if (construction.length === 0) {
      if (initialScaleDegrees.indexOf(key.scaleDegree(pitchChoice)) === -1) {
        throw new Error('Not a valid initial pitch:', pitchChoice)
      }
      construction.push(Pitch(pitchChoice).sciPitch())
    } else {
      var choiceNote = Pitch(pitchChoice)
      var sign = (choiceNote > Pitch(lastNote())) ? '' : '-'
      var interval = sign + choiceNote.intervalSize(lastNote())
      guide.choose(interval)
      construction.push(choiceNote.sciPitch())
    }
  }

  /**
   * returns all possible next pitches. Some chains may
   * have a length less than nDeep if that chain ends in epsilon.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {string[]} if nDeep=1, an array of pitch strings, else
   * an array of nDeep length arrays of terminal choices
   */
  this.choices = function (nDeep) {
    // special case if construcion is empty -- return only pitch classes
    if (construction.length === 0) {
      return initialScaleDegrees.map(function (scaleDegree) {
        return key.pitchAtDegree(scaleDegree).pitchClass()
      })
    }
    return guide.choices().map(function (intervalSize) {
      return key.plusInterval(lastNote(), intervalSize).sciPitch()
    })
  }
}

module.exports = GuidedMusicMachine
