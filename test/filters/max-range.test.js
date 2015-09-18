var test = require('tape')
var MusicMachine = require('../../lib/music-machine.js')
var cfGrammar = require('../../grammars/cantus-firmus.js')

test('filter: maxRange', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  var guide = machine.createGuide('B minor')

  t.deepEqual(guide.choices(),
    ['B'])
  guide.choose('B4')

  t.deepEqual(guide.choices().sort(),
    [ 'C#5', 'D5', 'E5', 'F#5', 'G5', 'B5',
      'A4', 'G4', 'B3', 'D4', 'E4', 'F#4' ].sort())

  guide.addFilter(MusicMachine.filter.maxRange(5))

  t.deepEqual(guide.choices().sort(),
    [ 'C#5', 'D5', 'E5', 'F#5',
      'A4', 'G4', 'E4', 'F#4' ].sort())

  guide.choose('F#5')
  guide.choose('E5')

  t.deepEqual(guide.choices().sort(),
    [ 'B4', 'C#5', 'D5', 'F#5' ].sort())

  t.end()
})
