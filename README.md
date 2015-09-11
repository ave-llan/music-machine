Musicbox is currently **under development**.

The idea is to define a context-free grammar similar to regular expressions which can be used to define a musical style and generate music.

## Goals

1. Input a context-free grammar to represent intervals in music
  - the grammar consists of simple intervals in relation to a scale
  - negative numbers indicate a descending interval

2. Allow an additional filter for contextual restrictions
  - max range
  - allowed interval qualities
  - limit repetitions/sequences

3. Internally, the program translates filtered intervals into actual notes in the provided scale and returns these notes as choices.
