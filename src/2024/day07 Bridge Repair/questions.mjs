import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((row) => {
    const [value, equations] = row.split(': ')
    const operators = equations.split(' ').map(Number)
    return { test: Number(value), operators }
  })
}

const isPossible = ({ test, operators, part }) => {
  let [first] = operators
  let queue = [{ agg: first, index: 1 }]
  while (queue.length > 0) {
    let { agg, index } = queue.shift()
    let next = operators?.[index]
    index++
    if (next) {
      if (agg + next <= test) queue.push({ agg: agg + next, index })
      if (agg * next <= test) queue.push({ agg: agg * next, index })
      if (part === 2) {
        const concat = Number(`${agg}${next}`)
        if (concat <= test) queue.push({ agg: concat, index })
      }
    } else if (agg === test) return true
  }
  return false
}
const part1 = () => {
  let data = parseInput(input)
  return data.filter(isPossible).reduce((agg, { test }) => (agg += test), 0)
}

const part2 = () => {
  let data = parseInput(input)
  return data
    .filter(({ test, operators }) => isPossible({ test, operators, part: 2 }))
    .reduce((agg, { test }) => (agg += test), 0)
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
