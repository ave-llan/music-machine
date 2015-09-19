// var plusIntervalInKey = require('./plus-interval-in-key.js')
var Key = require('nmusic').Key
var Pitch = require('nmusic').Pitch
var deepcopy = require('deepcopy')

/**
 * step-by-step construction of music from a predefined Music Machine
 * @constructor
 *
 * @param {GuidedDecisionGraph} guide - a Guided Decision Graph. See:
 * [GuidedDecisionGraph]{@link https://github.com/jrleszcz/grammar-graph/blob/master/api.md#GuidedDecisionGraph}
 * @param {Key} [key='C major'] - the key in which to apply the generic interval.
 * See [Key]{@link https://github.com/jrleszcz/nmusic/blob/master/api.md#Key}
 * @param {number[]} [initialScaleDegrees=[1]] - the scale degree(s) which
 * constructions can start on
 */
var GuidedMusicMachine = function (guide, key, initialScaleDegrees) {
  // if no key given, default to C major
  key = key || new Key('C', 'major')
  // scale degrees to start the construciton on. If not given, default to tonic
  initialScaleDegrees = initialScaleDegrees || [1]

  var construction = []     // chosen pitches
  var filters = []          // functions to filter out choices
  var thisGuide = this      // scope to be used in recursive functions

  // helper function to return the last note
  var lastNote = function () {
    return construction[construction.length - 1]
  }

  // helper function that applies all current filters to choices
  var applyFilters = function (choices) {
    if (filters.length === 0) {
      return choices // no filters, so return as given
    } else {
      return filters.reduce(function (filteredChoices, filter) {
        return filter(filteredChoices, thisGuide.construction())
      }, choices)
    }
  }

  /**
   * add a filter to the guide that will filter chioces based on the construction
   * @param {filter} filter - a callback filter function that returns valid choices
   */
  this.addFilter = function (filter) {
    filters.push(filter)
  }

  /**
   * the current construction
   * @returns {string[]} a terminal symbol chain
   */
  this.construction = function () {
    return deepcopy(construction)
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
   * @param {string|string[]} pitchChoice - a pitch string in the current set of next choices or an array of
   * choices to be applied sequentially
   * @throws throws an error if pitchChoice is not in the
   *      current set of {@link GuidedMusicMachine#choices}
   */
  this.choose = function (pitchChoice) {
    if (Array.isArray(pitchChoice)) {
      pitchChoice.forEach(thisGuide.choose)
    } else {
      var validChoices = thisGuide.choices()

      // special case if construcion is empty -- add note without choosing in guide
      // and check for pitch class instead of sciPitch
      if (construction.length === 0) {
        if (validChoices.indexOf(Pitch(pitchChoice).pitchClass()) === -1) {
          throw new Error('Not a valid initial pitch:', pitchChoice)
        }
        construction.push(Pitch(pitchChoice).sciPitch())
      } else {
        if (validChoices.indexOf(Pitch(pitchChoice).sciPitch()) === -1) {
          throw new Error('Not a valid next pitch:', pitchChoice)
        }
        var choiceNote = Pitch(pitchChoice)
        var sign = (choiceNote > Pitch(lastNote())) ? '' : '-'
        var interval = sign + choiceNote.intervalSize(lastNote())
        guide.choose(interval)
        construction.push(choiceNote.sciPitch())
      }
    }
  }

  /**
   * pop the last choice off the construction
   * @throws throws an error if called when construction is empty
   * @returns {string} the last pitch string of the construction that was
   * submitted through {@link GuidedMusicMachine#choose}
   */
  this.pop = function () {
    if (construction.length === 0) throw new Error('Cannot pop empty construction.')
    if (construction.length > 1) { // don't pop the guide if it is just the initial note
      guide.pop()
    }
    return construction.pop()
  }

  /**
   * returns an array of all possible next pitches, or an array of
   * nDeep {@link TreeNodes}.
   *
   * @param {number} [nDeep=1] - will search for nDeep possible choices
   * @returns {string[]} if nDeep=1, an array of pitch strings, else
   * an array of nDeep {@link TreeNodes}
   */
  this.choices = function (nDeep) {
    var currentChoices
    // special case if construcion is empty, use initialScaleDegrees
    if (construction.length === 0) {
      currentChoices = initialScaleDegrees.map(function (scaleDegree) {
        return key.pitchAtDegree(scaleDegree).pitchClass() // return only pitch class
      })
    } else {
      currentChoices = guide.choices().map(function (intervalSize) {
        return key.plusInterval(lastNote(), intervalSize).sciPitch()
      })
    }

    currentChoices = applyFilters(currentChoices)

    if (nDeep === undefined || nDeep === 1) {
      return currentChoices
    }
    // if nDeep > 1, map to TreeNodes and recursively expand to nDeep choices
    return currentChoices.map(function (choice) {
      var node = new TreeNode(choice)
      thisGuide.choose(choice)
      node.next = (nDeep - 1 > 1) ? thisGuide.choices(nDeep - 1)
                                  : thisGuide.choices(nDeep - 1).map(TreeNode)
      thisGuide.pop()
      return node
    })
  }

  /**
   * Peak inside the machine and get a list of possible constructions
   * at this point. Constructions are returned in the terms of the grammar,
   * not as notes.
   * @returns {string[]} a list of possible constructions
   * @example
   * guide.constructs()  => ['2 3 -2 JupiterTheme -5 InfinitePhrase']
   */
  this.constructs = function () {
    return guide.constructs()
  }
}

/**
 * Tree nodes to return decision trees from choices
 * @constructor
 *
 * @param {DecisionGraph} dg - a Decision Graph that defines a grammar
 * @property val - any value
 * @property {TreeNode[]} next - a list of TreeNodes this node links to
 * @see TreeNode returned from
 * [GuidedDecisionGraph.choices]{@link GuidedDecisionGraph#choices}
 */
var TreeNode = function (val) {
  if (!(this instanceof TreeNode)) return new TreeNode(val)
  this.val = val
  this.next = []
}

module.exports = GuidedMusicMachine
