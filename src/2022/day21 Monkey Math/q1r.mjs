// import input from './sample1.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const splitter = /(\w{4}): (\w{4}) (.) (\w{4})|(\w{4}): (\d+)/g
const parseInput = () => {
  let monkeys = {}
  input.split('\n').map(monkey => {
    let command = [...monkey.matchAll(splitter)][0]
    if (command[1])
      monkeys[command[1]] = {
        thing1: command[2],
        thing2: command[4],
        operator: command[3],
        answer: 0,
      }
    else
      monkeys[command[5]] = {
        real: Number(command[6]),
        imag: 0,
      }
  })
  return monkeys
}

const operate = operator =>
  ({
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  }[operator])

const process = monkeys => {
  const recursion = name => {
    if (monkeys[name].real) return monkeys[name].real
    return operate(monkeys[name].operator)(
      recursion(monkeys[name].thing1),
      recursion(monkeys[name].thing2),
    )
  }

  return recursion('root')
}

const part1 = () => {
  timingMonitor()
  let monkeys = parseInput()
  console.log(process(monkeys))
  console.log(timingMonitor())
}

part1()
