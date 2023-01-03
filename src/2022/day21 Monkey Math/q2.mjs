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
      }
    else
      monkeys[command[5]] = {
        answer: Number(command[6]),
      }
  })
  return monkeys
}

let answers = {}

const operate = (operation, who) => {
  switch (who) {
    case 'thing1':
      return {
        '+': (n, t1) => n - t1,
        '-': (n, t1) => t1 - n,
        '*': (n, t1) => n / t1,
        '/': (n, t1) => t1 / n,
      }[operation]
    case 'thing2':
      return {
        '+': (n, t2) => n - t2,
        '-': (n, t2) => n + t2,
        '*': (n, t2) => n / t2,
        '/': (n, t2) => n * t2,
      }[operation]
    default:
      return {
        '+': (t1, t2) => t1 + t2,
        '-': (t1, t2) => t1 - t2,
        '*': (t1, t2) => t1 * t2,
        '/': (t1, t2) => t1 / t2,
      }[operation]
  }
}

const print = ({ name, currentAnswer, thing1, thing1Answer, operator, thing2, thing2Answer }) =>
  console.log(
    `${name}(${currentAnswer || ''})=${thing1}(${thing1Answer || ''})${operator}${thing2}(${
      thing2Answer || ''
    })`,
  )

const process = monkeys => {
  while (!answers.humn) {
    for (let name in monkeys) {
      const { thing1, operator, thing2, answer } = monkeys[name]
      if (answer) {
        if (!answers[name]) answers[name] = answer
        continue
      }
      let currentAnswer = answers[name]
      let thing1Answer = answers[thing1]
      let thing2Answer = answers[thing2]
      if (currentAnswer && thing1Answer && thing2Answer) continue
      // else print({ name, currentAnswer, thing1, thing1Answer, operator, thing2, thing2Answer })
      if (operator === '=' && (thing1Answer || thing2Answer)) {
        if (!(thing1Answer && thing2Answer)) {
          const value = thing1Answer || thing2Answer
          if (value !== undefined) {
            answers[thing1] = value
            answers[thing2] = value
          }
        }
      } else if (!currentAnswer && thing1Answer && thing2Answer) {
        answers[name] = operate(operator)(thing1Answer, thing2Answer)
      } else if (!thing1Answer && currentAnswer && thing2Answer) {
        answers[thing1] = operate(operator, 'thing2')(currentAnswer, thing2Answer)
      } else if (!thing2Answer && currentAnswer && thing1Answer) {
        answers[thing2] = operate(operator, 'thing1')(currentAnswer, thing1Answer)
      }
    }
  }
  return answers.humn
}

const part1 = () => {
  timingMonitor()
  let monkeys = parseInput()
  monkeys.root.operator = '='
  delete monkeys.humn
  console.log(process(monkeys))
  console.log(timingMonitor())
}

part1()
