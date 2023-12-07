import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.match(/\d+/g).map(Number))

const quadraticEquation = (a, b, c) => {
  const delta = b * b - 4 * a * c
  const sqrtDelta = Math.floor(Math.sqrt(delta))
  const x1 = (-b + sqrtDelta) / (2 * a)
  const x2 = (-b - sqrtDelta) / (2 * a)
  return [x1, x2]
}

const getRangeLength = (t, d) => {
  const [x1, x2] = quadraticEquation(1, -t, d)
  const isInclusive = x1 * (t - x1) === d
  return Math.floor(x1) - Math.ceil(x2) + (isInclusive ? -1 : 1)
}

const part1 = () => {
  const [times, distances] = parseInput(input)
  return times.map((time, i) => getRangeLength(time, distances[i])).reduce((a, b) => a * b)
}

const part2 = () => {
  const [times, distances] = parseInput(input)
  const time = +times.join('')
  const distance = +distances.join('')
  return getRangeLength(time, distance)
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
