import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const left = [],
    right = []
  input.split('\n').map((row) => {
    let [l, r] = row.split('   ')
    left.push(Number(l))
    right.push(Number(r))
  })
  return { left, right }
}

const part1 = () => {
  let { left, right } = parseInput(input)
  left.sort((a, b) => a - b)
  right.sort((a, b) => a - b)
  let answer = 0
  for (let i = 0; i < left.length; i++) {
    answer += Math.abs(left[i] - right[i])
  }
  return answer
}

const part2 = () => {
  let { left, right } = parseInput(input)
  return left.reduce((agg, cur) => {
    const similarity = right.filter((r) => r === cur).length
    agg += cur * similarity
    return agg
  }, 0)
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
