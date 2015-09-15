var test = require('tape')
var MusicMachine = require('../lib/music-machine.js')
var cfGrammar = require('../grammars/cantus-firmus.js')
var Pitch = require('nmusic').Pitch

test('MusicMachine', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')
  var guide = machine.createGuide('E Major')
  t.equal(guide.tonic(), 'E')

  t.end()
})

test('MusicMachine filters', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  var noThirds = function (choices, construction) {
    if (construction.length === 0) return choices
    var previousNote = Pitch(construction[construction.length - 1])
    return choices.filter(function (note) {
      return previousNote.intervalSize(note) !== 3
    })
  }

  machine.addFilter(noThirds)
  var guide = machine.createGuide('D minor')
  guide.choose('D')
  t.deepEqual(guide.choices().sort(),
    ['E4', 'G4', 'A4', 'Bb4', 'D5',
    'C4', 'A3', 'G3', 'F3', 'D3'].sort())

  t.end()
})
