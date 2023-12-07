import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  return input.split('\n').map(r => {
    let [_, card] = r.split(': ')
    let [winning, numbers] = card.replaceAll('  ', ' ').split(' | ').map(r => r.split(' ').map(Number))
    return {counter: 1, winning, numbers}
  })
}

const part2 = () => {
  let data = parseInput(input)

  for (let row in data) {
    let {counter, winning, numbers} = data[row]
    winning
      .filter(v => numbers.includes(v))
      .forEach((_, v) => data[+row + v + 1].counter += counter)
  }
  return data.reduce((agg, cur) => agg + cur.counter, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({part: 2, answer, time: timingMonitor()})
}

run()
