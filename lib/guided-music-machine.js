/**
 * step-by-step construction of music from a decision graph
 * @constructor
 *
 * @param {GrammarGraph} grammarGraph - a grammar graph that defines a grammar
 * @param {string} startSymbol - the name of a vertex in the decision graph from which
 * to begin the construction
 * @param {Key} key - the key of this guide
 * @param {number[]} [initialScaleDegrees=[1]] - the scale degree(s) which
 * constructions can start on
 */
var GuidedMusicMachine = function (grammarGraph, startSymbol, key, initialScaleDegrees) {
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
   * is the current construction a valid, complete construction from the starting
   * nonterminal? ie, does the construction end in epsilon?
   * @returns {boolean} is the construction complete
   */
  this.isComplete = function () {
    return grammarGraph.isComplete()
  }

  this.choices = function (nDeep) {
    return grammarGraph.choices()
  }
}

module.exports = GuidedMusicMachine
