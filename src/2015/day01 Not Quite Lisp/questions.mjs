import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const floors = { '(': 1, ')': -1 }

const part1 = () => input.split('').reduce((agg, cur) => agg + floors[cur], 0)

const part2 = () => {
  for (let i = 0, floor = 0; i < input.split('').length; i++) {
    floor += floors[data[i]]
    if (floor < 0) return i + 1
  }
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
