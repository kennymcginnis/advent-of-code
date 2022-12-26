import data from './day2/input.txt'

// (1 for Rock, 2 for Paper, and 3 for Scissors) 
// (0 if you lost, 3 if the round was a draw, and 6 if you won).

const ROCK = 1, PAPER = 2, SCISSORS = 3, LOSS = 0, DRAW = 3, WIN = 6;

const score = {
  A: { // ROCK
    X: ROCK + DRAW,
    Y: PAPER + WIN,
    Z: SCISSORS + LOSS,
  },
  B: { // PAPER
    X: ROCK + LOSS,
    Y: PAPER + DRAW,
    Z: SCISSORS + WIN,
  },
  C: { // SCISSORS
    X: ROCK + WIN,
    Y: PAPER + LOSS,
    Z: SCISSORS + DRAW
  }
}

const split = data
  .split('\n')
  .map(l => l.split(' '))

const scored = split
  .map(l => score[l[0]][l[1]])

const total = scored
  .reduce((acc, curr) => acc + curr, 0)

console.log({split, scored, total})
