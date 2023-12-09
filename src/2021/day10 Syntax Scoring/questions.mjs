// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  const part = 1
  const data = rawData.split('\n').map(l => l.split(''))
  const symbols = {
    '(': { isOpening: true },
    '[': { isOpening: true },
    '{': { isOpening: true },
    '<': { isOpening: true },
    ')': { opener: '(', score: 3 },
    ']': { opener: '[', score: 57 },
    '}': { opener: '{', score: 1197 },
    '>': { opener: '<', score: 25137 },
  }

  let answer = 0
  for (let row = 0; row < data.length; row++) {
    let stack = []
    for (let col = 0; col < data[row].length; col++) {
      let symbol = data[row][col]
      let { isOpening, opener, score } = symbols[symbol]
      if (isOpening) {
        stack.push(symbol)
      } else {
        let prev = stack[stack.length - 1]
        if (printing) console.log(`comparing ${prev} with ${symbol}`)
        if (prev === opener) {
          stack.pop()
        } else {
          answer += score
          break
        }
      }
    }
  }

  console.log({ part, answer })
}

const part2 = () => {
  const part = 2
  const data = rawData.split('\n').map(l => l.split(''))
  const symbols = {
    '(': { isOpening: true, score: 1 },
    '[': { isOpening: true, score: 2 },
    '{': { isOpening: true, score: 3 },
    '<': { isOpening: true, score: 4 },
    ')': { opener: '(' },
    ']': { opener: '[' },
    '}': { opener: '{' },
    '>': { opener: '<' },
  }

  let answers = []
  for (let row = 0; row < data.length; row++) {
    let score = 0
    let stack = []
    let failed = false
    for (let col = 0; col < data[row].length; col++) {
      let symbol = data[row][col]
      let { isOpening, opener } = symbols[symbol]
      if (isOpening) {
        stack.push(symbol)
      } else {
        let prev = stack[stack.length - 1]
        if (printing) console.log(`comparing ${prev} with ${symbol}`)
        if (prev === opener) {
          stack.pop()
        } else {
          failed = true
          break
        }
      }
    }
    if (!failed) {
      stack.reverse()
      for (let todo of stack) {
        score = score * 5 + symbols[todo].score
      }
      answers.push(score)
    }
  }

  function median(input) {
    const sorted = Array.from(input).sort((a, b) => a - b)
    const middle = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) return (sorted[middle - 1] + sorted[middle]) / 2
    return sorted[middle]
  }

  let answer = median(answers)

  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
