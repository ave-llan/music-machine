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

  // same filter can be added with different params
  guide.addFilter(MusicMachine.filter.maxLength(2))
  t.deepEqual(guide.choices(), [])
  t.deepEqual(guide.choices(4), [])
  t.throws(function () {
    guide.choose('G2')
  }, Error)

  guide.pop()
  t.deepEqual(guide.choices().sort(),
    ['E3', 'F3', 'G3', 'A3', 'B3', 'D4',
     'C3', 'B2', 'A2', 'G2', 'F2', 'D2'].sort())

  // add exact duplicate, and nothing should change
  guide.addFilter(MusicMachine.filter.maxLength(2))
  t.deepEqual(guide.choices().sort(),
    ['E3', 'F3', 'G3', 'A3', 'B3', 'D4',
     'C3', 'B2', 'A2', 'G2', 'F2', 'D2'].sort())

  // retroactive filter precludes any more choices, but does not throw error
  guide.addFilter(MusicMachine.filter.maxLength(0))
  t.deepEqual(guide.choices(), [])
  t.deepEqual(guide.construction(), ['D3'])

  t.equal(guide.pop(), 'D3')

  t.throws(function () {
    guide.choose('D3')
  }, Error)

  t.deepEqual(guide.choices(), [])
  t.deepEqual(guide.construction(), [])

  t.end()
})
