import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  const splitter = /(\w+ \w+) bags contain (.*)/g
  const regex = new RegExp(/(\w+ \w+) bags contain (.*)/)
  const childRegex = new RegExp(/(\d+) (\w+ \w+) bag/)
  return input
    .split('\n')
    .map(item => {
      const [a, type, children] = item.match(regex)
      return {
        type,
        children:
          children === 'no other bags.'
            ? []
            : children.split(', ').map(item => {
                const [a, count, type] = item.match(childRegex) || []
                if (!a) return null
                return {
                  count: parseInt(count),
                  type,
                }
              }),
      }
    })
    .reduce((agg, item) => (agg.set(item.type, item), agg), new Map())
}

const part1 = () => {
  let data = parseInput(input)

  let outermost = ancestors(['shiny gold'])

  let answer = new Set()
  while (outermost.length) {
    let types = outermost.map(({ type }) => {
      answer.add(type)
      return type
    })
    outermost = ancestors(types)
  }

  function ancestors(types) {
    return [...data.values()].filter(({ children }) => {
      return children.some(child => types.includes(child.type))
    })
  }
  return answer.size
}

const part2 = () => {
  let data = parseInput(input)

  function descendants({ type, count = 1 }) {
    let { children } = data.get(type)
    if (!children.length) return count
    return count * (children.reduce((agg, bag) => agg + descendants(bag), 0) + 1)
  }
  return descendants(data.get('shiny gold')) - 1
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
