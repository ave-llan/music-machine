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

Module.exports = cfGrammar
