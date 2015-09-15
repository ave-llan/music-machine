var test = require('tape')
var plusIntervalInKey = require('../lib/plus-interval-in-key.js')

test('plusIntervalInKey()', function (t) {
  t.equal(plusIntervalInKey('f minor', 'F4', '3'), 'Ab4')
  t.equal(plusIntervalInKey('f minor', 'Ab3', '8'), 'Ab4')
  t.equal(plusIntervalInKey('f minor', 'G5', '6'), 'Eb6')

  t.equal(plusIntervalInKey('g  major', 'G3', '-2'), 'F#3')
  t.equal(plusIntervalInKey('g  major', 'F#2', '12'), 'C4')

  t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(plusIntervalInKey('Bb major', 'Bb4')),
    ['Bb4', 'C5', 'D5', 'Eb5', 'F5', 'G5', 'A5', 'Bb5'])

  t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(plusIntervalInKey('Bb major', 'C5')),
    ['C5', 'D5', 'Eb5', 'F5', 'G5', 'A5', 'Bb5', 'C6'])

  t.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(plusIntervalInKey('Bb minor', 'Bb4')),
    ['Bb4', 'C5', 'Db5', 'Eb5', 'F5', 'Gb5', 'Ab5', 'Bb5'])

  t.end()
})
