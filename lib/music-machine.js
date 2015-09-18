var GrammarGraph = require('grammar-graph')
var GuidedMusicMachine = require('./guided-music-machine.js')
var Key = require('nmusic').Key

/**
 * @typedef {string} SymbolChain - a string of one or more symbol names seperated by whitespace
 *
 * @see a SymbolChain is used as definitions in {@link MusicGrammar}
 *
 * @example
 * '4'                          // just a single symbol, means to go up a fourth
 * '5  -3'                      // go up a fifth, then down a third
 * 'JupiterTheme  4  -2'        // play the JupiterTheme (which will be defined in another definition),
 *                              // then go up a fourth, then down a second
 */

/**
 * a user defined context-free grammar formatted as an object consisting of key-value pairs,
 * with each [non-terminal symbol](https://github.com/jrleszcz/grammar-graph#non-terminal-symbols)
 * pointing to an array of one or more [symbol chains](https://github.com/jrleszcz/grammar-graph#symbol-chains)
 * choices for this non-terminal. All [terminals](https://github.com/jrleszcz/grammar-graph#terminal-symbols)
 * must be positive or negative numbers, representing musical intervals. Said another way, anything that is not
 * a number must have its own definition.
 *
 * @typedef {Object} MusicGrammar
 * @property {SymbolChain[]} symbol - each element of the array is a possible definition
 *    for this symbol.
 * @example
 * var jupiterGrammar = {
 * InfinitePhrase: [ 'JupiterTheme InfinitePhrase',      // InfinitePhrase has two possible definitions
 *                  'SecondMotive InfinitePhrase' ],
 *   JupiterTheme: [ '2  3  -2' ],                       // JupiterTheme has only one definition
 *   SecondMotive: [ '4  StepDown' ],
 *       StepDown: [ '-2', '-2  StepDown']
 * }
 * // non-terminals: InfinitePhrase, JupiterTheme, SecondMotive, StepDown
 * //     terminals: -2, 2, 3, 4
 */

/**
 * creates a new MusicMachine which can generate Guides for music construction.
 * @constructor
 *
 * @param {MusicGrammar} grammar - an object representing a musical grammar.
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
   * @param {filter} filter - a callback filter function that returns valid choices
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
 * a user defined function that {@link GuidedMusicMachine#choices}
 * will be passed through, filtering out certain choices.
 * @name filter
 * @function
 * @param {string[]} choices - the current choices as returned
 *    by {@link GuidedMusicMachine#choices}
 * @param {string[]} construction - the curent constrution as returned
 *    by {@link GuidedMusicMachine#construction}
 * @returns {string[]} the choices with notes filtered out
 */

/**
 * a collection of filter generators that generate filters
 * to be passed to {@link MusicMachine#addFilter}
 *
 * @static
 */
MusicMachine.filter = {
  /**
   * limit the length of a construction
   * @function
   * @param {number} max - the maximum length (inclusive) of the
   *                             desired construction
   * @returns {filter} a filter that limits the length of the construction
   * @see {@link maxLength}
   */
  maxLength: require('./filters/max-length.js'),

  /**
   * filter generator that returns a filter which restricts the maximum
   *                             range of the construction
   * @param {number} maxIntervalSize - the maximum range (inclusive) of the
   *                             desired construction
   * @returns {filter} a filter that limits the range of the construction
   * @see {@link maxRange}
   */
  maxRange: require('./filters/max-range.js'),

  /**
   * only allow certain interval qualities
   * @function
   * @param {...char} quality - characters representing quality.
   * 'm' = minor, 'M' = Major, 'P' = Perfect, 'd' = diminished, 'A' = augmented
   * @returns {filter} a filter that only allows the specified intervals
   * @see {@link allowedIntervalQualities}
   */
  allowedIntervalQualities: require('./filters/allowed-interval-qualities.js')
}

module.exports = MusicMachine
