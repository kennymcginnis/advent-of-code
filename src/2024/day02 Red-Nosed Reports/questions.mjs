import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split(' ').map(Number))
}

const isSafe = (row) => {
  let increasing = false
  let decreasing = false
  let safe = true

  for (let i = 1; i < row.length; i++) {
    let prev = row[i - 1]
    let curr = row[i]
    if (prev < curr) increasing = true
    if (prev > curr) decreasing = true
    // The levels are either all increasing or all decreasing.
    if (increasing && decreasing) {
      // console.log('Invalid because both increasing && decreasing', row)
      safe = false
      break
    }
    // Any two adjacent levels differ by at least one and at most three.
    const difference = Math.abs(prev - curr)
    if (difference === 0 || difference > 3) {
      // console.log(`Invalid because difference is ${difference}`, row)
      safe = false
      break
    }
  }
  return safe
}

const part1 = () => {
  let data = parseInput(input)
  return data.filter((row) => isSafe(row)).length
}

const part2 = () => {
  let data = parseInput(input)
  return data.filter((row) => {
    if (isSafe(row)) {
      return true
    } else {
      for (let i = 0; i < row.length; i++) {
        let temp = [...row]
        temp.splice(i, 1)
        if (isSafe(temp)) return true
      }
    }
  }).length
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
