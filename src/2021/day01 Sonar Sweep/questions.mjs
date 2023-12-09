import data from './input.mjs'
// import data from './sample1.mjs'

const input = data.split('\n').map(Number)

const part1 = input.filter((v, i) => i !== 0 && v > input[i - 1]).length

const part2 = input.filter(
  (v, i) =>
    i > 2 && input[i - 2] + input[i - 1] + input[i] > input[i - 3] + input[i - 2] + input[i - 1],
).length

console.log({ part1, part2 }) // > 1274
