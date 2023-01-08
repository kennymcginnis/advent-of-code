import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(Number)

const isValid = (input, value) => {
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      if (input[i] + input[j] === value) return true
    }
  }
  return false
}

const part1 = (rawInput, preamble) => {
  let data = parseInput(rawInput)
  for (let row in data) {
    if (row < preamble) continue
    let input = data.slice(row - preamble, row)
    if (!isValid(input, data[row])) return data[row]
  }
}

const contiguous = (input, value) => {
  for (let i = 0; i < input.length; i++) {
    let acc = input[i],
      min = input[i],
      max = input[i]
    for (let j = i + 1; j < input.length; j++) {
      acc += input[j]
      if (acc > value) continue
      if (input[j] < min) min = input[j]
      if (input[j] > max) max = input[j]
      if (acc === value) return min + max
    }
  }
  return false
}

const part2 = (rawInput, preamble) => {
  let data = parseInput(rawInput)
  let invalid = part1(rawInput, preamble)
  return contiguous(data, invalid)
}

const run = () => {
  timer = Date.now()
  let answer = part1(input, 25)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(input, 25)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
