import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  const splitter = /(\d+)-(\d+)\s(\w):\s(\w+)/g
  input.split('\n').map(r => {
    let hmmm = [...r.matchAll(splitter)]
    return { command, units: Number(units) }
  })
}

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
