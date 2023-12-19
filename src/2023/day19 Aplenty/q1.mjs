import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  let [top, bottom] = input.split('\n\n')
  let workflows = top.split('\n').reduce((agg, element) => {
    let [_, label, rules] = element.match(/(\w+){(.*)}/)
    rules = rules.split(',').map((rule) => {
      const work = rule.match(/(x|m|a|s)(<|>)(\d+):(\w+)/)
      if (work) {
        return {
          category: work[1],
          condition: work[2],
          value: work[3],
          next: work[4],
        }
      } else {
        return { next: rule }
      }
    })
    agg[label] = rules
    return agg
  }, {})

  let parts = bottom.split('\n').map((row) =>
    row.split(',').reduce((a, c) => {
      const part = c.match(/(x|m|a|s)=(\d+)/)
      a[part[1]] = Number(part[2])
      return a
    }, {}),
  )
  return { parts, workflows }
}

const part1 = () => {
  let { workflows, parts } = parseInput(input)

  function runWorkflow(workflow, part) {
    for (let { category, condition, value, next } of workflow) {
      switch (condition) {
        case '<':
          if (value <= part[category]) continue
          break
        case '>':
          if (value >= part[category]) continue
          break
      }
      if (next === 'A') return true
      if (next === 'R') return false
      return runWorkflow(workflows[next], part)
    }
  }

  return parts
    .filter((part) => runWorkflow(workflows.in, part))
    .reduce((agg, { x, m, a, s }) => agg + x + m + a + s, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
