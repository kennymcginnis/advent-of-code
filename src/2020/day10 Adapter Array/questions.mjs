import small from './small-sample.mjs'
import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input =>
  input
    .split('\n')
    .map(Number)
    .sort((a, b) => a - b)

const produce = (jolts, rating) => rating - 3 <= jolts && jolts <= rating
const adapter = sorted => [...sorted].pop() + 3

const part1 = () => {
  let sorted = parseInput(input)
  let data = [0, ...sorted, adapter(sorted)]
  let answers = {
    1: 0,
    3: 0,
  }
  for (let row = 1; row < data.length; row++) {
    answers[data[row] - data[row - 1]] += 1
  }
  return answers['1'] * answers['3']
}

const part2 = () => {
  let sorted = parseInput(input)
  let final = adapter(sorted)
  let data = [...sorted, final]
  let dist = { 0: 1 }
  for (let row of data) {
    dist[row] = (dist[row - 3] || 0) + (dist[row - 2] || 0) + (dist[row - 1] || 0)
  }
  return dist[data[data.length - 1]]
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
