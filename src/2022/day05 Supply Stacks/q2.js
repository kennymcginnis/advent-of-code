import data from './input.txt'

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
    const splitAt = stacks[from].length - move
    const moving = stacks[from].slice(splitAt)
    stacks[from] = stacks[from].slice(0, splitAt)
    stacks[to] = [...stacks[to], ...moving]
  })

const answer = stacks
  .map(stack => stack[stack.length - 1])
  .join('')

console.log(answer)
