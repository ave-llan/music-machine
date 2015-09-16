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


## Example

Install the npm module.
```
npm install music-machine
```

Require music-machine and input a grammar to define a style. The grammar format shown in the [overview](https://github.com/jrleszcz/music-machine#overview) is simplified, so see [grammar syntax](https://github.com/jrleszcz/grammar-graph#grammar) for details.
```js
var MusicMachine = require('music-machine')

var jupiterGrammar = {
  InfinitePhrase: [ 'JupiterTheme   InfinitePhrase',
                    'JupiterPattern InfinitePhrase',
                    'SecondTheme    InfinitePhrase' ],
  JupiterPattern: [ 'JupiterTheme JupiterTheme -5' ],
    JupiterTheme: [ '2 3 -2' ],
     SecondTheme: [ '4 StepDown' ],
        StepDown: [ '-2', '-2 StepDown']
}
```
Create a new MusicMachine by passing it the grammar along with the symbol at which to start the construction.
```js
var machine = new MusicMachine(jupiterGrammar, 'InfinitePhrase')
```


## Goals

1. Input a context-free grammar to represent intervals in music
  - the grammar consists of simple intervals in relation to a scale
  - negative numbers indicate a descending interval

2. Allow additional filters for contextual restrictions. Filters can be permanent or expire after a certain point (ie, expire after a direction change)
  - max range
  - allowed interval qualities
  - limit repetitions/sequences

3. Internally, the program translates filtered intervals into actual notes in the provided scale and returns these notes as choices.

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