var clone = require('../lib/utils/clone.js')

/*
 * define grammar in only one direction here, and then reverse
 * below by flipping 'Upward'/'Downard' and positive numbers to negative
 */
var upwardOnly = {
  UpwardPhrase: ['UpwardLeap DownwardStepPhrase UpwardPhrase',
                 'UpwardStepPhrase DownwardPhrase',
                 'UpwardLeapForwardPhrase DownwardStepPhrase UpwardPhrase'],
  UpwardLeap: ['4', '5', '6', '8'],
  UpwardLeapForwardPhrase: ['2 UpwardLeapForward DownwardStepPhrase UpwardPhrase'],
  UpwardLeapForward: ['4', '5'],
  UpwardStepPhrase: ['UpwardFrom2Phrase', 'UpwardFrom3Phrase',
                     'UpwardLeapForwardPhrase'],
  UpwardFrom2Phrase: ['2', '2 UpwardContinueFrom2'],
  UpwardFrom3Phrase: ['3', '3 UpwardContinueFrom3'],
  UpwardContinueFrom2: ['2', '3', '2 2', '2 3', '3 2',
                  '2 2 2', '2 3 2', '2 2 3', '3 2 2'],
  UpwardContinueFrom3: ['2', '2 2', '2 2 2', '2 3']
}

// build the updward and downard grammar
var cfGrammar = {
  Start: ['UpwardPhrase', 'DownwardPhrase']
}

for (var def in upwardOnly) {
  // add upward phrase as is
  cfGrammar[def] = clone(upwardOnly[def])

  // reverse downward/upward and make positive numbers negative
  var downwardDef = clone(upwardOnly[def]).map(function (definition) {
    return definition.split(' ').map(function (symbol) {
      if (symbol.indexOf('Downward') > -1) {
        return symbol.replace('Downward', 'Upward')
      } else if (symbol.indexOf('Upward') > -1) {
        return symbol.replace('Upward', 'Downward')
      } else if (!isNaN(symbol)) {
        return '-' + symbol        // make positive number negatie
      } else {
        return symbol
      }
    }).join(' ')
  })

  cfGrammar[def.replace('Upward', 'Downward')] = downwardDef
}

module.exports = cfGrammar
