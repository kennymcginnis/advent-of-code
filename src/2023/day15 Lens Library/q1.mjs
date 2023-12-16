import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split(',')

function hash(s) {
  let cur_val = 0
  for (let i = 0; i < s.length; ++i) {
    cur_val += s.charCodeAt(i)
    cur_val *= 17
    cur_val %= 256
  }
  return cur_val
}

const part1 = () => {
  let data = parseInput(input)
  return data.reduce((acc, x) => acc + hash(x), 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
