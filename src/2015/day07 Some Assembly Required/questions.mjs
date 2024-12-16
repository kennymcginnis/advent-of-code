import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = (wires = {}) => {
  const data = input.split('\n')
  var ops = {
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    LSHIFT: (a, b) => a << b,
    RSHIFT: (a, b) => a >> b,
    NOT: (a, b) => b ^ 65535,
    VAL: (a, b) => b,
  }

  while (data.length) {
    var [o, a, op, b, c] = data.shift().match(/([a-z0-9]*)\b\s?([A-Z]+)?\s?(\S+)\s->\s(\S+)/)
    if ([a, b].every((i) => !i || wires.hasOwnProperty(i) || /\d+/.test(i)))
      wires[c] = wires[c] || ops[op || 'VAL'](...[a, b].map((i) => wires[i] || +i))
    else data.push(o)
  }

  return wires.a
}

const part2 = () => {
  return part1({ b: part1() })
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
