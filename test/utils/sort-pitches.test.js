var test = require('tape')
var sortPitches = require('../../lib/utils/sort-pitches.js')

test('sortPitches()', function (t) {
  t.deepEqual(sortPitches(['D3', 'D4', 'Db4', 'Dbb3', 'E2', 'E4']),
    [ 'E2', 'Dbb3', 'D3', 'Db4', 'D4', 'E4' ])

  t.deepEqual(sortPitches([ 'E2', 'Dbb3', 'D3', 'Db4', 'D4', 'E4' ].reverse()),
    [ 'E2', 'Dbb3', 'D3', 'Db4', 'D4', 'E4' ])

  t.deepEqual(sortPitches(['C4']), ['C4'])
  t.deepEqual(sortPitches([]), [])

  t.deepEqual(sortPitches(['C4', 'B##3', 'Cb4', 'B#3', 'Cbb4']),
    [ 'Cbb4', 'Cb4', 'C4', 'B#3', 'B##3' ])

  // is the sort stable? B#3 and C4 are equal so swap them and see if results swap
  t.deepEqual(sortPitches(['B#3', 'B##3', 'Cb4', 'C4', 'Cbb4']),
    [ 'Cbb4', 'Cb4', 'B#3', 'C4', 'B##3' ])

  t.end()
})
