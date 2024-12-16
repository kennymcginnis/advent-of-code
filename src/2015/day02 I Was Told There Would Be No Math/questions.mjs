import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split('x').map(Number))

const part1 = (data) => {
  return data.reduce((acc, row) => {
    const [l, w, h] = row
    const [lw, wh, hl] = [l * w, w * h, h * l]
    const [smallest] = [lw, wh, hl].sort((a, b) => a - b)
    return 2 * lw + 2 * wh + 2 * hl + smallest + acc
  }, 0)
}

const part2 = (data) => {
  return data.reduce((acc, row) => {
    const [l, w, h] = row
    const [smaller, smallest] = [l, w, h].sort((a, b) => a - b)
    return 2 * smaller + 2 * smallest + l * w * h + acc
  }, 0)
}

const run = () => {
  let data = parseInput(input)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
