import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(Number)

const part1 = () => {
  let data = parseInput(input)
  for (let first of data) {
    for (let second of data) {
      if (first + second === 2020) return first * second
    }
  }
}

const part2 = () => {
  let data = parseInput(input)
  for (let first of data) {
    for (let second of data) {
      for (let third of data) {
        if (first + second + third === 2020) return first * second * third
      }
    }
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
