/*
 * in this simplified version, a negative number indicates a change of direction.
 * So if the previous direction was down, a -2 means to go up 2 and continue
 * going up until hitting another negative number.
 *
 * note: this will need to be changed as musicmachine will interpret
 * negative numbers as descending intervals
 */
var cfGrammar = {
  Phrases: ['Phrase Phrases'],
  Phrase: ['LeapPhrase', 'StepPhrase'],
  LeapPhrase: ['LeapChange StepPhrase'],
  StepPhrase: ['Reverse2Phrase', 'Reverse3Phrase'],
  Reverse2Phrase: ['Reverse2', 'Reverse2 ContinueFrom2'],
  Reverse3Phrase: ['Reverse3', 'Reverse3 ContinueFrom3'],
  ContinueFrom2: ['LeapForward StepPhrase', '2', '3', '2 2', '2 3', '3 2',
                  '2 2 2', '2 3 2', '2 2 3', '3 2 2'],
  ContinueFrom3: ['2', '2 2', '2 2 2', '2 3'],
  LeapForward: ['4', '5'],
  Reverse2: ['-2'],
  Reverse3: ['-3'],
  LeapChange: ['-4', '-5', '-6', '-8']
}

module.exports = cfGrammar
