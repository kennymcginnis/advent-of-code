import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split(',').map((r) => r.split('-').map(Number))
}

const part1 = () => {
  let answer = 0
  let data = parseInput(input)
  for (let [min, max] of data) {
    for (let i = min; i <= max; i++) {
      let str = i.toString()
      let firstHalf = str.slice(0, Math.floor(str.length / 2))
      let secondHalf = str.slice(Math.floor(str.length / 2))
      if (firstHalf === secondHalf) answer += i
    }
  }
  return answer
}

const part2 = () => {
  let answer = 0
  let data = parseInput(input)
  for (let [min, max] of data) {
    for (let i = min; i <= max; i++) {
      let str = i.toString()
      for (let j = 1; j <= Math.floor(str.length / 2); j++) {
        if (test(str.slice(0, j), str.slice(j))) {
          answer += i
          break
        }
      }
    }
  }
  return answer
}

const test = (left, right) => {
  while (left.length < right.length) {
    if (!right.startsWith(left)) return false
    right = right.slice(left.length)
  }
  return left === right
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
