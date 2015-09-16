var test = require('tape')
var MusicMachine = require('../../lib/music-machine.js')
var cfGrammar = require('../../grammars/cantus-firmus.js')

test('filter: maxLength', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')

  // test with maxLength of 1
  var guide = machine.createGuide('Bb major')
  guide.addFilter(MusicMachine.filter.maxLength(1))

  t.deepEqual(guide.choices(), ['Bb'])
  t.deepEqual(guide.choices(1), ['Bb'])
  t.deepEqual(guide.choices(2),
    [
      { val: 'Bb', next: [] }
    ])
  t.deepEqual(guide.choices(5),
    [
      { val: 'Bb', next: [] }
    ])

  guide.choose('Bb5')
  t.deepEqual(guide.choices(), [])

  // test with maxLength of 3
  guide = machine.createGuide('D dorian')
  guide.addFilter(MusicMachine.filter.maxLength(3))
  t.deepEqual(guide.choices(), ['D'])
  guide.choose('D3')
  t.deepEqual(guide.choices().sort(),
    ['E3', 'F3', 'G3', 'A3', 'B3', 'D4',
     'C3', 'B2', 'A2', 'G2', 'F2', 'D2'].sort())

  guide.choose('F2')
  t.deepEqual(guide.choices().sort(),
    ['G2', 'A2'].sort())

  t.deepEqual(guide.choices(2).sort(),
    [
      { val: 'G2', next: [] },
      { val: 'A2', next: [] }
    ].sort())

  t.deepEqual(guide.choices(5).sort(),
    [
      { val: 'G2', next: [] },
      { val: 'A2', next: [] }
    ].sort())

  guide.choose('G2')
  t.deepEqual(guide.choices(), [])

  t.equal(guide.pop(), 'G2')
  t.deepEqual(guide.choices().sort(),
    ['G2', 'A2'].sort())

  t.deepEqual(guide.choices(2).sort(),
    [
      { val: 'G2', next: [] },
      { val: 'A2', next: [] }
    ].sort())

  t.end()
})
