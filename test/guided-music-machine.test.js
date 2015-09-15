var test = require('tape')
var GuidedMusicMachine = require('../lib/guided-music-machine.js')
var GrammarGraph = require('grammar-graph')
var cfGrammar = require('../grammars/cantus-firmus.js')

test('GuidedMusicMachine', function (t) {
  var cfGraph = new GrammarGraph(cfGrammar)
  var guide = new GuidedMusicMachine(cfGraph.createGuide('Start'), 'D minor', [1])
  t.equal(guide.tonic(), 'D')
  t.false(guide.isComplete())
  t.deepEqual(guide.construction(), [])

  t.end()
})
