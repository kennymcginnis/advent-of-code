import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => [`${r} 0`.split(' ').map(Number)])

const part1 = () => {
  let data = parseInput(input)
  for (let row of data) {
    let current = 0
    do {
      row[current + 1] = Array(row[current].length - 1).fill(0)
      for (let i = 0; i < row[current + 1].length - 1; i++) {
        row[current + 1][i] = row[current][i + 1] - row[current][i]
      }
      current++
    } while (row[current].some((r) => r !== 0))

    for (let i = row.length - 2; i >= 0; i--) {
      row[i][row[i].length - 1] = row[i][row[i].length - 2] + row[i + 1][row[i + 1].length - 1]
    }
  }
  return data.reduce((a, b) => a + b[0][b[0].length - 1], 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
