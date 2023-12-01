import sample1 from './sample1.mjs'
import sample2 from './sample2.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(r => r.split('').filter(Number))

const part1 = () => {
  let data = parseInput(input)
  return data.reduce((a, c) => Number(c[0] + c[c.length - 1]) + a, 0)
}

const part2 = () => {
  let numbers = {
    one: 'o1e',
    two: 't2o',
    three: 't3e',
    four: '4',
    five: '5e',
    six: '6',
    seven: '7n',
    eight: 'e8t',
    nine: 'n9e',
  }
  Object.keys(numbers).forEach(r => input = input.replaceAll(r, numbers[r]))
  let data = parseInput(input)
  return data.reduce((a, c) => Number(c[0] + c[c.length - 1]) + a, 0) // 54714 < x < 54780
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
