import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => [`0 ${r}`.split(' ').map(Number)])

const part2 = () => {
  let data = parseInput(input)
  for (let row of data) {
    let current = 0
    do {
      row[current + 1] = Array(row[current].length - 1).fill(0)
      for (let i = 1; i < row[current + 1].length; i++) {
        row[current + 1][i] = row[current][i + 1] - row[current][i]
      }
      current++
    } while (row[current].some((r) => r !== 0))

    for (let i = row.length - 2; i >= 0; i--) {
      row[i][0] = row[i][1] - row[i + 1][0]
    }
  }
  return data.reduce((a, b) => a + b[0][0], 0)
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
