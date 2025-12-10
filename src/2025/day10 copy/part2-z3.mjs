import sample from './sample.mjs'
import input from './input.mjs'
import { init } from 'z3-solver'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  function parseLine(line) {
    const [, , b, r] = line.match(/^\[([.#]+)\]\s+((?:\([\d,]+\)\s*)+)\{([\d,]+)\}$/)
    const buttons = [...b.matchAll(/\(([\d,]+)\)/g)].map((m) => m[1].split(',').map(Number))
    const requirements = r.split(',').map(Number)
    return { buttons, requirements }
  }
  return input.split('\n').map(parseLine)
}

let data = parseInput(input)

init().then(async ({ Context }) => {
  timer = Date.now()
  let part2 = 0
  for (const { buttons, requirements } of data) {
    const { Int, Optimize } = Context('main')
    const solver = new Optimize()
    const variables = []

    for (let i = 0; i < buttons.length; i++) {
      const value = Int.const(String.fromCodePoint(i + 97))
      solver.add(value.ge(0))
      variables.push(value)
    }

    for (let i = 0; i < requirements.length; i++) {
      let condition = Int.val(0)
      for (let j = 0; j < buttons.length; j++) {
        if (buttons[j].includes(i)) condition = condition.add(variables[j])
      }
      condition = condition.eq(Int.val(requirements[i]))
      solver.add(condition)
    }
    const sum = variables.reduce((a, x) => a.add(x), Int.val(0))
    solver.minimize(sum)
    if ((await solver.check()) == 'sat') {
      part2 += parseInt(solver.model().eval(sum).toString())
    }
  }
  console.log({ part2, time: timingMonitor() })
})
