var test = require('tape')
var MusicMachine = require('../../lib/music-machine.js')
var cfGrammar = require('../../grammars/cantus-firmus.js')

test('filter: allowedIntervalQualities', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  var guide = machine.createGuide('Bb major')
  guide.choose('Bb4')
  guide.choose('A4')
  t.deepEqual(guide.choices().sort(),
    ['Bb4', 'C5', 'D5', 'Eb5', 'F5', 'A5', 'F4', 'G4', 'D4', 'Eb4'].sort())

  guide.addFilter(MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P'))
  t.deepEqual(guide.choices().sort(),
    ['Bb4', 'C5', 'D5', 'F5', 'A5', 'F4', 'G4', 'D4'].sort())

  // try adding another quality filter excluding minor intervals
  guide.addFilter(MusicMachine.filter.allowedIntervalQualities('M', 'P'))
  t.deepEqual(guide.choices().sort(),
    ['D5', 'A5', 'F4', 'G4', 'D4'].sort())

  guide.addFilter(MusicMachine.filter.allowedIntervalQualities('M'))
  t.deepEqual(guide.choices().sort(),
    ['F4', 'G4'].sort())

  // try a different mode
  guide = machine.createGuide('C lydian')

  guide.choose('C4')
  t.deepEqual(guide.choices().sort(),
    [ 'D4', 'E4', 'F#4', 'G4', 'A4', 'C5',
      'B3', 'A3', 'C3', 'E3', 'F#3', 'G3' ].sort())

  guide.addFilter(MusicMachine.filter.allowedIntervalQualities('M', 'm', 'P'))
  t.deepEqual(guide.choices().sort(),
    [ 'D4', 'E4', 'G4', 'A4', 'C5',
      'B3', 'A3', 'C3', 'E3', 'G3' ].sort())

  t.throws(function () {
    guide.choose('F#4')
  }, Error)

  t.end()
})
