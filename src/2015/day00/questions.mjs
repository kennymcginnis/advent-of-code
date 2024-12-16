import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

// const parseInput = (input) => {
//   const splitter = /(turn on|turn off|toggle)\s*(\d*),(\d*)\D*(\d*),(\d*)/g
//   return input.split('\n').map((r) => {
//     let [_, command, r1, c1, r2, c2] = [...r.matchAll(splitter)][0]
//     return { command, from: { row: Number(r1), col: Number(c1) }, to: { row: Number(r2), col: Number(c2) } }
//   })
// }

const part1 = (data) => {
  return
}

const part2 = (data) => {
  return
}

const run = () => {
  let data = parseInput(sample)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
