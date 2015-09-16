Interactively generate music by defining a musical style using a [context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar) and optional contextual filters.


## Overview

This module is an extension of [grammar-graph](https://www.npmjs.com/package/grammar-graph) built specifically to construct music from patterns of [interval numbers](https://en.wikipedia.org/wiki/Interval_(music)#Number) which can then be applied to any [key](https://en.wikipedia.org/wiki/Key_(music)) or [mode](https://en.wikipedia.org/wiki/Mode_(music)#Modern).

An example definition in a grammar might be:
```
Intone: 3 3 -2 -2 -2 -2

```
This means to move up a third, then up a third again, and then down a second four times.

```
// construct Intone in C minor
 +3  +3 -2 -2  -2 -2
C  Eb  G  F  Eb  D  C

// construct Intone in D major
 +3  +3 -2 -2  -2 -2
D  F#  A  G  F#  E  D
```

Music-machine solves the problem of applying patterns to any key. If you instead want to define a musical grammar in terms of literal notes like this:
```
Jupiter: C5 D5 F5 E5
```
You should use [grammar-graph](https://www.npmjs.com/package/grammar-graph) directly instead of this library.


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