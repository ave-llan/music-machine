Interactively generate music by defining a musical style in terms of [interval numbers](https://en.wikipedia.org/wiki/Interval_(music)#Number) in a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar).

## Overview

This library is an extension of [grammar-graph](https://www.npmjs.com/package/grammar-graph) which enables music patterns to be applied in any key or mode. If you instead want to define a musical grammar in terms of literal notes, like the theme from [Mozart's Jupiter Symphony](https://www.youtube.com/watch?v=SiX3z_fOR5k), `JupiterTheme: C D F E`, you should use grammar-graph directly instead of this library. In music-machine, the `JupiterTheme` pattern would look like this:
```
JupiterTheme: 2  3  -2
```
This means to move up a second, then up a third, and then down a second. Note that the interval numbers here are defining the distance *between* notes, which is why only three intervals are needed to describe a four note pattern.

The `JupiterTheme` could then be applied to any key:
```
JupiterTheme in C minor:
  +2   +3   -2
C    D    F    Eb

JupiterTheme in D major:
  +2   +3   -2
D    E    G    F#
```

Good music is often made up of just a few small patterns which are combined to make something bigger. For example, repeating `JupiterTheme` twice makes a nice sequence, so we might define a larger pattern with it. I will also add a final descending fifth at the end, just for fun:
```
JupiterPattern: JupiterTheme  JupiterTheme  -5

JupiterPattern in C major:
 +2  +3  -2   +2   +3   -2   -5
C   D   F   E    F    A    G    C
```



## Music Grammar
A music grammar is a list of rules in an object. Let's examine a grammar that uses the Jupiter theme:
```js
var jupiterGrammar = {
  InfinitePhrase: [ 'JupiterTheme InfinitePhrase',
                    'SecondMotive InfinitePhrase' ],
    JupiterTheme: [ '2  3  -2' ],
    SecondMotive: [ '4  StepDown' ],
        StepDown: [ '-2',
                    '-2  StepDown']
}
```

#### Rules
A rule simply means to replace a symbol with its definition. If we are making music and come across the symbol `JupiterTheme`, we will replace it with its definition: `2 3 -2`. Some rules have multiple options, such as `StepDown` which can be rewritten as `-2` or `-2  StepDown`.

More formally, a grammar is an object consisting of key-value pairs, with each [non-terminal symbol](https://github.com/jrleszcz/music-machine#non-terminal-symbols) pointing to an array of one or more [symbol chains](https://github.com/jrleszcz/music-machine#symbol-chains) choices for this non-terminal. [See here](https://github.com/jrleszcz/grammar-graph#grammar) for an example of a non-musical grammar in the same format that builds text creatures.

#### Symbol Chains
`2  3  -2` and `4  StepDown` are symbol chains. Each symbol is seperated by white-space, so the first symbol chain is made up of three symbols: `2, 3, -2`.

#### Terminal Symbols
If a symbol has no definition in the grammar, it is a terminal. In a music grammar, **terminals must be numbers** representing intervals. The four terminal symbols in the example are: `-2, 2, 3, 4`.

#### Non-terminal Symbols
If a symbol has a definition in the grammar, it is non-terminal and can be broken down further. A non-terminal's definition is an array of one or more symbol chains indicating possible choices for this rule. The four non-terminal symbols in the example are: `InfinitePhrase, JupiterTheme, SecondMotive, StepDown`.

#### Recursive definitions
Recursive definitions are what make a grammar interesting and powerful, and ensure that the music will never stop. One recursive definition in our example is: `StepDown: [ '-2', '-2  StepDown']`. This allows us to either move `-2` once if we immediately choose the first option, or to descend infinitely if we always choose the second option. The most conspicuous recursive symbol is: `InfinitePhrase: [ 'JupiterTheme InfinitePhrase', 'SecondMotive InfinitePhrase' ]`.  Both of these definitions lead right back to `InfinitePhrase` and so will go on and on no matter which option we choose.

Do not define a non-terminal to equal only itself.  This will not work: `Infinity: ['Infinity']`. MusicMachine must be able to reach a non-terminal (interval) from any point in the grammar.


## Example

Install the npm module.
```
npm install music-machine
```

Require music-machine and input a musical grammar to define a style. The grammar examples in [overview](https://github.com/jrleszcz/music-machine#overview) are simplified, so see [grammar syntax](https://github.com/jrleszcz/grammar-graph#grammar) for details.
```js
var MusicMachine = require('music-machine')

var jupiterGrammar = {
  InfinitePhrase: [ 'JupiterTheme InfinitePhrase',
                    'SecondMotive InfinitePhrase' ],
    JupiterTheme: [ '2  3  -2' ],
    SecondMotive: [ '4  StepDown' ],
        StepDown: [ '-2', '-2  StepDown']
}
```
Create a new MusicMachine by passing it the grammar along with the symbol at which to start the construction.
```js
var machine = new MusicMachine(jupiterGrammar, 'InfinitePhrase')
```



## Filters
[this section will be expanded]
For your convenience, you can pass filters to instances of MusicMachine or GuidedMusicMachine which reduce the number of choices. For example, you might want to pass a guide a filter that limits a construction to a total range of a 10th.

## Docs
[View the api documentation here.](api.md)

## Development

Clone the git repository and install development dependencies:
```
git clone https://github.com/jrleszcz/music-machine.git
cd music-machine
npm install
```

To run eslint and tape tests:
```
npm test
```

To generate api documentation for [api.md](api.md):
```
npm run docs
```