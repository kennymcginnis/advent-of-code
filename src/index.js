import data from './2022/day2/input.txt'

// (1 for Rock, 2 for Paper, and 3 for Scissors)
/*
 X means you need to lose,
 Y means you need to end the round in a draw,
 Z means you need to win."
*/

// (0 if you lost, 3 if the round was a draw, and 6 if you won).

const ROCK = 1, PAPER = 2, SCISSORS = 3, LOSS = 0, DRAW = 3, WIN = 6;

const score = {
  A: { // ROCK
    X: LOSS + SCISSORS,
    Y: DRAW + ROCK,
    Z: WIN + PAPER,
  },
  B: { // PAPER
    X: LOSS + ROCK,
    Y: DRAW + PAPER,
    Z: WIN + SCISSORS,
  },
  C: { // SCISSORS
    X: LOSS + PAPER,
    Y: DRAW + SCISSORS,
    Z: WIN + ROCK
  }
}

const split = data
  .split("\n")
  .map(l => l.split(' '))

const scored = split
  .map(l => score[l[0]][l[1]])

const total = scored
  .reduce((acc, curr) => acc + curr, 0)

console.log({split, scored, total})
