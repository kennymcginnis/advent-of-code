import data from './input.txt'

/*
              [L] [M]         [M]
          [D] [R] [Z]         [C] [L]
          [C] [S] [T] [G]     [V] [M]
  [R]     [L] [Q] [B] [B]     [D] [F]
  [H] [B] [G] [D] [Q] [Z]     [T] [J]
  [M] [J] [H] [M] [P] [S] [V] [L] [N]
  [P] [C] [N] [T] [S] [F] [R] [G] [Q]
  [Z] [P] [S] [F] [F] [T] [N] [P] [W]
   1   2   3   4   5   6   7   8   9
 */

let stacks = [
  [],
  ['Z', 'P', 'M', 'H', 'R'],
  ['P', 'C', 'J', 'B'],
  ['S', 'N', 'H', 'G', 'L', 'C', 'D'],
  ['F', 'T', 'M', 'D', 'Q', 'S', 'R', 'L'],
  ['F', 'S', 'P', 'Q', 'B', 'T', 'Z', 'M'],
  ['T', 'F', 'S', 'Z', 'B', 'G'],
  ['N', 'R', 'V'],
  ['P', 'G', 'L', 'T', 'D', 'V', 'C', 'M'],
  ['W', 'Q', 'N', 'J', 'F', 'M', 'L'],
]

data
  .split('\n')
  .map(l => l
    .split(',').map(Number)
  )
  .forEach(rearrangement => {
    const [move, from, to] = rearrangement
    for (let step = 0; step < move; step++) {
      const moving = stacks[from].pop()
      stacks[to].push(moving)
    }
  })

const answer = stacks
  .map(stack => stack[stack.length -1])
  .join('')

console.log(answer)
