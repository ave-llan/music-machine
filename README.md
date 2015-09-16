Musicbox interactively generates music using a provided context-free grammar and optional contextual filters.

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
git clone https://github.com/jrleszcz/grammar-graph.git
cd grammar-graph
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