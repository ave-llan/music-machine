var GrammarGraph = require('grammar-graph')
var GuidedMusicMachine = require('./guided-music-machine.js')

/**
 * creates a new MusicMachine which can generate Guides for music construction.
 * @constructor
 *
 * @param {object} grammar - an object representing a musical grammar.
 * @param {string} startSymbol - the symbol at which to start constructions
 * @param {number[]} [initialScaleDegrees=[1]] - the scale degree(s) which
 * constructions can start on
 */
var MusicMachine = function (grammar, startSymbol, initialScaleDegrees) {
  var graph = new GrammarGraph(grammar)

  /**
   * get an array of vertex names in the graph
   * @returns {string[]} the vertex names in this graph
   */
  this.vertices = function () {
    return graph.vertices()
  }

  /**
   * get a new GuidedMusicMachine using this decision graph
   * @param {string} [key='C major'] - the key in which to apply the generic interval. Must
   * be a valid pitch string and mode name seperated by whitespace such as 'Bb minor'.
   * @returns {GuidedMusicMachine} a new guide from the provided start point
   * @see {@link GuidedMusicMachine} for the methods available on the Guide
   */
  this.createGuide = function (key) {
    key = key || 'C major'
    return new GuidedMusicMachine(graph, startSymbol, key, initialScaleDegrees)
  }
}

module.exports = MusicMachine
