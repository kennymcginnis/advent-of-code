import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const mod = (n, m) => ((n % m) + m) % m

const runProgram = (A, B, C, program) => {
  let ptr = 0
  const out = []
  while (program[ptr] !== undefined) {
    const code = program[ptr]
    const operand = program[ptr + 1]
    let combo
    if ([0, 1, 2, 3].includes(operand)) combo = operand
    if (operand === 4) combo = A
    if (operand === 5) combo = B
    if (operand === 6) combo = C

    if (code === 0) A = Math.floor(A / Math.pow(2, combo))
    if (code === 1) B = (B ^ operand) >>> 0 //js xor unsigned
    if (code === 2) B = mod(combo, 8)

    let jumped = false
    if (code === 3 && A !== 0) {
      ptr = operand
      jumped = true
    }
    if (code === 4) B = (B ^ C) >>> 0
    if (code === 5) out.push(mod(combo, 8))
    if (code === 6) B = Math.floor(A / Math.pow(2, combo))
    if (code === 7) C = Math.floor(A / Math.pow(2, combo))

    if (!jumped) ptr += 2
  }
  return out.join(',')
}

const part1 = (data) => {
  let [A, B, C, ...program] = data.match(/\d+/gm).map(Number)
  return runProgram(A, B, C, program)
}

const part2 = (data) => {
  let [A, B, C, ...program] = data.match(/\d+/gm).map(Number)

  const Q = []
  Q.push({ result: '', len: 0 })
  while (Q.length) {
    const q = Q.shift()
    if (q.len === program.length) {
      // answer
      return parseInt(q.result, 2)
    }
    const from = parseInt(q.result + '000', 2)
    const to = parseInt(q.result + '111', 2)
    const expect = program.slice((q.len + 1) * -1).join(',')
    for (let a = from; a <= to; a++) {
      const r = runProgram(a, B, C, program)
      if (r === expect) Q.push({ result: a.toString(2), len: q.len + 1 })
    }
  }
}

const run = () => {
  timer = Date.now()
  let answer = part1(input)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(input)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
