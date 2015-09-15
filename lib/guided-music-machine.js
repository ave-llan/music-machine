var plusIntervalInKey = require('./plus-interval-in-key.js')
var Pitch = require('nmusic').Pitch

/**
 * step-by-step construction of music from a decision graph
 * @constructor
 *
 * @param {GrammarGraph} grammarGraph - a grammar graph that defines a grammar
 * @param {string} startSymbol - the name of a vertex in the decision graph from which
 * to begin the construction
 * @param {string} [key='C major'] - the key in which to apply the generic interval. Must
 * be a valid pitch string and mode name seperated by whitespace such as 'Bb major'.
 * @param {number[]} [initialScaleDegrees=[1]] - the scale degree(s) which
 * constructions can start on
 */
var GuidedMusicMachine = function (grammarGraph, startSymbol, key, initialScaleDegrees) {
  key = key || 'C major'
  initialScaleDegrees = initialScaleDegrees || [1]

  var construction = []  // chosen pitches

  var tonic = Pitch(key.split(/\s+/)[0]).pitchClass()

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
    return tonic
  }

  /**
   * is the current construction a valid, complete construction from the starting
   * nonterminal? ie, does the construction end in epsilon?
   * @returns {boolean} is the construction complete
   */
  this.isComplete = function () {
    return grammarGraph.isComplete()
  }

  this.choices = function (nDeep) {
    // special case if construcion is empty -- return only pitch classes
    if (!construction) {
      return initialScaleDegrees.map(plusIntervalInKey(key, ))
    }
    return grammarGraph.choices().map()
  }
}

module.exports = GuidedMusicMachine
