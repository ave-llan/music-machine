var test = require('tape')
var GuidedMusicMachine = require('../lib/guided-music-machine.js')
var MusicMachine = require('../lib/music-machine.js')
var GrammarGraph = require('grammar-graph')
var cfGrammar = require('../grammars/cantus-firmus.js')
var Key = require('nmusic').Key

test('GuidedMusicMachine', function (t) {
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
  t.throws(function () {
    guide.choose('E6')
  }, Error)
  guide.choose('Bb3')
  t.deepEqual(guide.construction(), ['D3', 'Bb3'])
  t.deepEqual(guide.choices().sort(),
    ['A3', 'G3'].sort())

  t.equal(guide.pop(), 'Bb3')
  t.deepEqual(guide.construction(), ['D3'])
  t.deepEqual(guide.choices().sort(),
    ['E3', 'F3', 'G3', 'A3', 'Bb3', 'D4',
    'C3', 'Bb2', 'A2', 'G2', 'F2', 'D2'].sort())
  guide.choose('D2')
  t.deepEqual(guide.construction(), ['D3', 'D2'])
  t.deepEqual(guide.choices().sort(),
    ['E2', 'F2'].sort())

  var guide2 = new GuidedMusicMachine(cfGraph.createGuide('Start'),
                                      new Key('Eb', 'major'),
                                      [1, 3, 5])
  t.equal(guide2.tonic(), 'Eb')
  t.deepEqual(guide2.choices(), ['Eb', 'G', 'Bb'])

  t.end()
})

test('GuidedMusicMachine nDeep choices', function (t) {
  var jupiterGrammar = {
    InfinitePhrase: [ 'JupiterTheme InfinitePhrase',
                      'SecondMotive InfinitePhrase' ],
    JupiterTheme: [ '2  3  -2' ],
    SecondMotive: [ '4  StepDown' ],
    StepDown: [ '-2',
                '-2  StepDown' ]
  }

  var jupiter = new MusicMachine(jupiterGrammar, 'InfinitePhrase', [1, 5])
  t.deepEqual(jupiter.vertices().sort(),
    [ '2',
      '3',
      '4',
      'InfinitePhrase',
      'JupiterTheme',
      'SecondMotive',
      'StepDown',
      '_InfinitePhrase_1',
      '_InfinitePhrase_2',
      '_StepDown_1',
      '-2' ].sort())

  var guide = jupiter.createGuide('G dorian')
  t.equal(guide.tonic(), 'G')
  t.deepEqual(guide.choices(4),
    [
      {
        'val': 'G',
        'next': [
          {
            'val': 'A4',
            'next': [
              {
                'val': 'C5',
                'next': [
                  {
                    'val': 'Bb4',
                    'next': []
                  }
                ]
              }
            ]
          },
          {
            'val': 'C5',
            'next': [
              {
                'val': 'Bb4',
                'next': [
                  {
                    'val': 'C5',
                    'next': []
                  },
                  {
                    'val': 'E5',
                    'next': []
                  },
                  {
                    'val': 'A4',
                    'next': []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'val': 'D',
        'next': [
          {
            'val': 'E4',
            'next': [
              {
                'val': 'G4',
                'next': [
                  {
                    'val': 'F4',
                    'next': []
                  }
                ]
              }
            ]
          },
          {
            'val': 'G4',
            'next': [
              {
                'val': 'F4',
                'next': [
                  {
                    'val': 'G4',
                    'next': []
                  },
                  {
                    'val': 'Bb4',
                    'next': []
                  },
                  {
                    'val': 'E4',
                    'next': []
                  }
                ]
              }
            ]
          }
        ]
      }
    ])

  guide.choose(['G2', 'A2', 'C3', 'Bb2'])
  t.deepEqual(guide.construction(),
    ['G2', 'A2', 'C3', 'Bb2'])
  t.deepEqual(guide.constructs().sort(),
    [ '2 3 -2 2 3 -2 InfinitePhrase',
      '2 3 -2 4 StepDown InfinitePhrase' ].sort())
  guide.choose([ 'E3', 'D3', 'C3', 'D3', 'F3', 'E3', 'A3', 'G3', 'C4', 'Bb3' ])
  t.deepEqual(guide.construction(),
    [ 'G2',
      'A2',
      'C3',
      'Bb2',
      'E3',
      'D3',
      'C3',
      'D3',
      'F3',
      'E3',
      'A3',
      'G3',
      'C4',
      'Bb3' ])

  t.deepEqual(guide.choices(3),
    [
      {
        'val': 'C4',
        'next': [
          {
            'val': 'E4',
            'next': [
              {
                'val': 'D4',
                'next': []
              }
            ]
          }
        ]
      },
      {
        'val': 'E4',
        'next': [
          {
            'val': 'D4',
            'next': [
              {
                'val': 'E4',
                'next': []
              },
              {
                'val': 'G4',
                'next': []
              },
              {
                'val': 'C4',
                'next': []
              }
            ]
          }
        ]
      },
      {
        'val': 'A3',
        'next': [
          {
            'val': 'Bb3',
            'next': [
              {
                'val': 'D4',
                'next': []
              }
            ]
          },
          {
            'val': 'D4',
            'next': [
              {
                'val': 'C4',
                'next': []
              }
            ]
          },
          {
            'val': 'G3',
            'next': [
              {
                'val': 'A3',
                'next': []
              },
              {
                'val': 'C4',
                'next': []
              },
              {
                'val': 'F3',
                'next': []
              }
            ]
          }
        ]
      }
    ])
  t.false(guide.isComplete())
  t.end()
})
