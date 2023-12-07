import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  let maps = input.split('\n\n').map(r => r.split('\n').map(s => s.split(' ').map(Number)))
  for (let map of maps) {
    map.shift()
    map.sort((a, b) => a[1] - b[1])
  }
  let seeds = maps.shift()[0]
  return { seeds, maps }
}

const part1 = () => {
  let { seeds, maps } = parseInput(input)
  let minValue = Number.MAX_SAFE_INTEGER
  for (let seed of seeds) {
    let value = seed
    for (let map of maps) {
      for (let [destination, source, length] of map) {
        if (value >= source && value <= source + length) {
          value = (destination - source) + value
          break
        }
      }
    }
    if (value < minValue) minValue = value
  }
  return minValue
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
