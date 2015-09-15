var test = require('tape')
var GuidedMusicMachine = require('../lib/guided-music-machine.js')
var GrammarGraph = require('grammar-graph')
var cfGrammar = require('../grammars/cantus-firmus.js')
var Key = require('nmusic').Key

test('GuidedMusicMachine initializaiton', function (t) {
  var cfGraph = new GrammarGraph(cfGrammar)
  var guide = new GuidedMusicMachine(cfGraph.createGuide('Start'),
                                     new Key('D', 'minor'),
                                     [1])
  t.equal(guide.tonic(), 'D')
  t.false(guide.isComplete())
  t.deepEqual(guide.construction(), [])
  t.deepEqual(guide.choices(), ['D'])
  guide.choose('D')
  t.deepEqual(guide.construction(), ['D4'])
  t.deepEqual(guide.choices().sort(),
    ['E4', 'F4', 'G4', 'A4', 'Bb4', 'D5',
    'C4', 'Bb3', 'A3', 'G3', 'F3', 'D3'].sort())

  t.equal(guide.pop(), 'D4')
  t.deepEqual(guide.construction(), [])
  t.deepEqual(guide.choices(), ['D'])

  t.throws(function () {
    guide.choose('A')
  }, Error)

  guide.choose('D3')
  t.deepEqual(guide.construction(), ['D3'])
  t.deepEqual(guide.choices().sort(),
    ['E3', 'F3', 'G3', 'A3', 'Bb3', 'D4',
    'C3', 'Bb2', 'A2', 'G2', 'F2', 'D2'].sort())
  t.throws(function () {
    guide.choose('F#3')
  }, Error)

  var guide2 = new GuidedMusicMachine(cfGraph.createGuide('Start'),
                                      new Key('Eb', 'major'),
                                      [1, 3, 5])
  t.equal(guide2.tonic(), 'Eb')
  t.deepEqual(guide2.choices(), ['Eb', 'G', 'Bb'])

  t.end()
})
