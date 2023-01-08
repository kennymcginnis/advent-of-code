import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(r => r.split(''))

const slope = (data, [right, down]) => {
  let rows = data.length,
    cols = data[0].length,
    row = 0,
    col = 0,
    trees = 0
  while (row < rows - 1) {
    row += down
    col = (col + right) % cols
    if (data[row][col] === '#') trees++
  }
  return trees
}

const part1 = () => {
  let data = parseInput(input)
  let trees = slope(data, [3, 1])
  return trees
}

const part2 = () => {
  let data = parseInput(input)
  let slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]
  return slopes.reduce((a, c) => (a *= slope(data, c)), 1)
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
