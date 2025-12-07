import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]
const clone = (input) => JSON.parse(JSON.stringify(input))
const print = (board) => {
  console.log('')
  for (let row of board) console.log(row.join(''))
}

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

const fewerThanFour = (data, row, col) => neighbors.filter(([r, c]) => data[row + r]?.[col + c] === '@').length < 4

const part1 = () => {
  let data = input.split('\n').map((r) => r.split(''))
  // let output = clone(data)
  // print(data)
  let answer = 0
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[0].length; col++) {
      if (data[row][col] === '@' && fewerThanFour(data, row, col)) {
        // output[row][col] = 'x'
        answer++
      }
    }
  }
  // print(output)
  return answer
}

const part2 = () => {
  let grid = {}
  input.split('\n').map((row, r) =>
    row.split('').forEach((value, c) => {
      grid[[r, c]] = value === '@'
    }),
  )
  let answer = 0
  let changed = true
  while (changed) {
    changed = false
    for (let [row, col] of Object.keys(grid).map((k) => k.split(',').map(Number))) {
      if (grid[[row, col]]) {
        if (neighbors.filter(([r, c]) => grid[[row + r, col + c]]).length < 4) {
          changed = true
          grid[[row, col]] = false
          answer++
        }
      }
    }
  }
  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
