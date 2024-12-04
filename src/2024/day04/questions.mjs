import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const xmas = ['X', 'M', 'A', 'S']
const neighbors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const part1 = () => {
  let data = parseInput(input)

  let answer = 0
  for (let row in data) {
    for (let col in data[row]) {
      answer += neighbors.filter(([r, c]) =>
        xmas.every((x, i) => data?.[+row + r * i]?.[+col + c * i] === x),
      ).length
    }
  }
  return answer
}

const part2 = () => {
  let data = parseInput(input)

  let answer = 0
  for (let row in data) {
    for (let col in data[row]) {
      if (
        data?.[+row]?.[+col] === 'A' &&
        ((data?.[+row - 1]?.[+col - 1] === 'M' && data?.[+row + 1]?.[+col + 1] === 'S') ||
          (data?.[+row - 1]?.[+col - 1] === 'S' && data?.[+row + 1]?.[+col + 1] === 'M')) &&
        ((data?.[+row - 1]?.[+col + 1] === 'M' && data?.[+row + 1]?.[+col - 1] === 'S') ||
          (data?.[+row - 1]?.[+col + 1] === 'S' && data?.[+row + 1]?.[+col - 1] === 'M'))
      ) {
        answer++
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
