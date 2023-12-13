import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input
    .split('\n')
    .map((row) => row.split(' '))
    .map(([spring, damage]) => [spring, damage.split(',').map(Number)])

const part1 = () => {
  let data = parseInput(sample)
  return
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
