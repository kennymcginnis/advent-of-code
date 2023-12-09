import sample1 from './sample1.mjs'
import sample2 from './sample2.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const splitter = /(\d+)-(\d+)\s(\w):\s(\w+)/g
  let [instructions, nodes] = input.split('\n\n')

  const network = nodes
    .split('\n')
    .map((line) => {
      const matcher = /(\w+) = \((\w+), (\w+)\)/
      const [, loc, L, R] = line.match(matcher)
      return { loc, L, R }
    })
    .reduce((map, location) => {
      const { loc, ...rest } = location
      map[loc] = rest
      return map
    }, {})

  return { instructions, network }
}

const part1 = () => {
  let { instructions, network } = parseInput(input)
  let pos = 'AAA',
    steps = -1
  while (pos !== 'ZZZ') {
    steps += 1
    let direction = instructions[steps % instructions.length]
    pos = network[pos][direction]
  }
  return steps + 1
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
