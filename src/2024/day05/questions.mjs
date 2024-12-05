import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  const [rules_input, updates_input] = input.split('\n\n')
  const rules_array = rules_input.split('\n').map(line => line.split('|').map(Number))
  const rules = {}
  for (let rule of rules_array) {
    if (rules[rule[0]]) rules[rule[0]].push(rule[1])
    else rules[rule[0]] = [rule[1]]
  }
  const updates = updates_input.split('\n').map(update => update.split(',').map(Number))
  return { rules, updates }
}

const isValid = (update, rules) => {
  const cloned = [...update]
  let valid = true
  while (valid && cloned.length > 1) {
    const last = cloned.pop()
    valid = rules[last] ? !cloned.some(page => rules[last].includes(page)) : true
  }
  return valid
}
const part1 = () => {
  let { rules, updates } = parseInput(input)
  let answer = 0
  for (let update of updates) {
    let valid = isValid(update, rules)
    if (valid) answer += update[Math.floor(update.length / 2)]
  }
  return answer
}

const reorder = (update, rules) => {
  for (let reversed = update.length - 1; reversed > 0; reversed--) {
    const last = update[reversed]
    if (rules[last]) {
      for (let forward = 0; forward < reversed; forward++) {
        if (rules[last].includes(update[forward])) {
          // switch the two values
          update[reversed] = update[forward]
          update[forward] = last
          return update
        }
      }
    }
  }
}
const part2 = () => {
  let { rules, updates } = parseInput(input)
  let answer = 0
  for (let update of updates) {
    let valid = isValid(update, rules)
    if (valid) continue
    while (!valid) {
      update = reorder(update, rules)
      valid = isValid(update, rules)
    }
    answer += update[Math.floor(update.length / 2)]
  }
  return answer
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

