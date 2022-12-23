// import input from './sample.mjs'
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
        answer: Number(command[6]),
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
  while (!monkeys.root.answer) {
    for (let name in monkeys) {
      if (
        !monkeys[name].answer &&
        monkeys[monkeys[name].thing1].answer &&
        monkeys[monkeys[name].thing2].answer
      ) {
        monkeys[name].answer = operate(monkeys[name].operator)(
          monkeys[monkeys[name].thing1].answer,
          monkeys[monkeys[name].thing2].answer,
        )
        // console.log(`${name}: ${monkeys[name].thing1}(${monkeys[monkeys[name].thing1].answer}) ${monkeys[name].operator} ${monkeys[name].thing2}(${monkeys[monkeys[name].thing2].answer}) = ${monkeys[name].answer}`)
      }
    }
  }
  return monkeys.root.answer
}

const part1 = () => {
  timingMonitor()
  let monkeys = parseInput()
  console.log(process(monkeys))
  console.log(timingMonitor())
}

part1()
