import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  let [top] = input.split('\n\n')
  return top.split('\n').reduce((agg, element) => {
    let [_, label, rules] = element.match(/(\w+){(.*)}/)
    rules = rules.split(',').map((rule) => {
      const work = rule.match(/(x|m|a|s)(<|>)(\d+):(\w+)/)
      if (work) {
        return {
          category: work[1],
          condition: work[2],
          value: Number(work[3]),
          next: work[4],
        }
      } else {
        return { next: rule }
      }
    })
    agg[label] = rules
    return agg
  }, {})
}

const part2 = () => {
  let answer = 0
  let workflows = parseInput(input)

  const queue = [
    {
      workflow: 'in',
      xmin: 1,
      xmax: 4000,
      mmin: 1,
      mmax: 4000,
      amin: 1,
      amax: 4000,
      smin: 1,
      smax: 4000,
    },
  ]

  while (queue.length) {
    const part = queue.shift()
    const { workflow, xmin, xmax, mmin, mmax, amin, amax, smin, smax } = part

    if (workflow === 'R') continue
    if (workflow === 'A') {
      answer += (1 + xmax - xmin) * (1 + mmax - mmin) * (1 + amax - amin) * (1 + smax - smin)
      console.log(
        ['x', 'm', 'a', 's']
          .map((c) => `${c}: [${part[`${c}min`]} => ${part[`${c}max`]}]`)
          .join(' '),
      )
      continue
    }

    // split and add to queue
    for (let { category, condition, value, next } of workflows[workflow]) {
      let valid = { ...part, workflow: next }
      switch (condition) {
        case '<':
          valid[`${category}max`] = Math.min(valid[`${category}max`], value - 1)
          queue.push(valid)
          // remaining
          part[`${category}min`] = Math.max(valid[`${category}min`], valid[`${category}max`] + 1)
          break
        case '>':
          valid[`${category}min`] = Math.max(valid[`${category}min`], value + 1)
          queue.push(valid)
          // remaining
          part[`${category}max`] = Math.min(valid[`${category}max`], valid[`${category}min`] - 1)
          break
        default:
          queue.push(valid)
          break
      }
    }
  }

  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
