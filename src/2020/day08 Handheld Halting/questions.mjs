import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  return input.split('\n').map(r => {
    const [op, value] = r.split(' ')
    return { op, value: Number(value) }
  })
}

const execute = data => {
  let step = 0,
    accumulator = 0,
    last = data.length - 1

  const operations = {
    acc: (step, value) => {
      accumulator += value
      return (step += 1)
    },
    jmp: (step, value) => (step += value),
    nop: step => (step += 1),
  }

  while (true) {
    if (step === data.length) return { accumulator, step }
    let { op, value, executed } = data[step]
    if (executed) break
    data[step].executed = true
    step = operations[op](step, value)
  }
  return { accumulator, step }
}

const part1 = () => {
  let data = parseInput(input)
  return execute(data).accumulator
}

const part2 = () => {
  let data = parseInput(input)

  for (let row in data) {
    if (data[row].op !== 'acc') {
      let input = data.map(row => ({ ...row, executed: false }))
      input[row].op = row.op === 'nop' ? 'jmp' : 'nop'
      let { accumulator, step } = execute(input)
      if (step === data.length) {
        return accumulator
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
