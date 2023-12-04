import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  return input.split('\n').map(r => {
    let [_, card] = r.split(': ')
    return card.replaceAll('  ', ' ').split(' | ').map(r => r.split(' ').map(Number))
  })
}

let double = x => x === 0 ? 0 : [...Array(x - 1)].reduce(a => a * 2, 1)

const part1 = () => {
  let data = parseInput(input)
  return data.reduce((agg, [winning, numbers]) => agg + double(winning.filter(v => numbers.includes(v)).length), 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({part: 1, answer, time: timingMonitor()})
}

run()
