import sample from './sample.mjs'
import input from './input.mjs'

let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, -1], // top-left
  [-1, 0], //  top-middle
  [-1, 1], //  top-right
  [0, -1], //  left
  // [0, 0], //   middle (self)
  [0, 1], //   right
  [1, -1], //  bottom-left
  [1, 0], //   bottom-middle
  [1, 1], //   bottom-right
]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const clone = (input) => JSON.parse(JSON.stringify(input))

const match = (input, output) =>
  output.every((row, r) =>
    row.every((item, c) => {
      return item === input[r][c]
    }),
  )

const unoccupied = (data, row, col) =>
  neighbors.every(([r, c]) => {
    return (
      data?.[row + r]?.[col + c] === undefined ||
      data[row + r][col + c] === 'L' ||
      data[row + r][col + c] === '.'
    )
  })

const fourOrMore = (data, row, col) =>
  neighbors.filter(([r, c]) => {
    return data?.[row + r]?.[col + c] !== undefined && data[row + r][col + c] === '#'
  }).length >= 4

const fiveOrMore = (data, row, col) =>
  neighbors.filter(([r, c]) => {
    for (let i = 1; i < 100; i++) {
      let viewing = data?.[row + r * i]?.[col + c * i]
      if (viewing === undefined) return false
      if (viewing === 'L') return false
      if (viewing === '#') return true
      else continue
    }
  }).length >= 5

const lineOfSight = (data, row, col) =>
  neighbors.every(([r, c]) => {
    for (let i = 1; i < 100; i++) {
      let viewing = data?.[row + r * i]?.[col + c * i]
      if (viewing === undefined) return true
      if (viewing === 'L') return true
      if (viewing === '#') return false
      else continue
    }
  })

const score = (input) =>
  input.flat().reduce((agg, item) => {
    if (item === '#') agg++
    return agg
  }, 0)

const print = (board) => {
  console.log('')
  for (let row of board) console.log(row.join(''))
}

const part1 = (rawInput) => {
  let output = parseInput(rawInput)
  let input = [...Array(output.length)].map(() => Array(output[0].length))

  if (printing) print(output)

  while (!match(input, output)) {
    input = clone(output)
    for (let row = 0; row < input.length; row++) {
      for (let col = 0; col < input[0].length; col++) {
        if (input[row][col] === '.') continue
        if (unoccupied(input, row, col)) output[row][col] = '#'
        if (fourOrMore(input, row, col)) output[row][col] = 'L'
      }
    }
    if (printing) print(output)
  }

  return score(input)
}

const part2 = (rawInput) => {
  let output = parseInput(rawInput)
  let input = [...Array(output.length)].map(() => Array(output[0].length))

  if (printing) print(output)

  while (!match(input, output)) {
    input = clone(output)
    for (let row = 0; row < input.length; row++) {
      for (let col = 0; col < input[0].length; col++) {
        if (input[row][col] === '.') continue
        if (lineOfSight(input, row, col)) output[row][col] = '#'
        if (fiveOrMore(input, row, col)) output[row][col] = 'L'
      }
    }
    if (printing) print(output)
  }

  return score(input)
}

const run = () => {
  timer = Date.now()
  let answer = part1(input)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(input)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
