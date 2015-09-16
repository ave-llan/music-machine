var GrammarGraph = require('grammar-graph')
var GuidedMusicMachine = require('./guided-music-machine.js')
var Key = require('nmusic').Key

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
  var filters = []     // filter functions to be added to guides when created

  /**
   * get an array of vertex names in the graph
   * @returns {string[]} the vertex names in this graph
   */
  this.vertices = function () {
    return graph.vertices()
  }

  /**
   * add a filter to the guide that will filter chioces based on the construction
   * @param {filter} filter - a filter function that returns valid choices
   */
  this.addFilter = function (filter) {
    filters.push(filter)
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
    var keyInfo = key.split(/\s+/)
    var keySignature = new Key(keyInfo[0], keyInfo[1])
    var guide = new GuidedMusicMachine(graph.createGuide(startSymbol),
                                  keySignature,
                                  initialScaleDegrees)
    filters.forEach(guide.addFilter)
    return guide
  }
}

/**
 * a collection of filter generators that generate filters
 * to be passed to {@link MusicMachine#addFilter}
 *
 * @static
 */
MusicMachine.filter = {
  /**
   * limit the length of a construction
   * @param {number} max - the maximum length (inclusive) of the
   *                             desired construction
   * @returns {filter} a filter that limits the length of the construction
   * @see {@link maxLength}
   */
  maxLength: require('./filters/max-length.js'),

  /**
   * only allow certain interval qualities
   * @param {...char} quality - characters representing quality.
   * 'm' = minor, 'M' = Major, 'P' = Perfect, 'd' = diminished, 'A' = augmented
   * @returns {filter} a filter that only allows the specified intervals
   * @see {@link allowedIntervalQualities}
   */
  allowedIntervalQualities: require('./filters/allowed-interval-qualities.js')
}

module.exports = MusicMachine
