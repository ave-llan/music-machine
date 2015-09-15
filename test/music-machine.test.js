var test = require('tape')
var MusicMachine = require('../lib/music-machine.js')
var cfGrammar = require('../grammars/cantus-firmus.js')

test('MusicMachine', function (t) {
  var machine = new MusicMachine(cfGrammar, 'Start')
  var guide = machine.createGuide('E Major')
  t.equal(guide.tonic(), 'E')

  t.end()
})
