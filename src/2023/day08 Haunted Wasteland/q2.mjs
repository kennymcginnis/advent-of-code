import sample1 from './sample1.mjs'
import sample2 from './sample2.mjs'
import sample3 from './sample3.mjs'
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

const part2 = () => {
  let { instructions, network } = parseInput(input)

  let endings = Object.keys(network).filter((k) => k[2] === 'Z')

  return Object.keys(network)
    .filter((k) => k[2] === 'A') // ends with A
    .map((k) => countSteps(k)) // count steps to reach a node ending in Z
    .reduce((a, c) => findLCM(a, c), 1)

  function countSteps(pos) {
    let steps = -1
    while (!endings.includes(pos)) {
      steps += 1
      let direction = instructions[steps % instructions.length]
      pos = network[pos][direction]
    }
    return steps + 1
  }

  // Calculates the least common multiple
  function findLCM(a, b) {
    var min = Math.min(a, b),
      max = Math.max(a, b)

    let maxLcm = min * max
    let lcm = max
    while (lcm <= maxLcm) {
      if (lcm % min === 0 && lcm % max === 0) {
        return lcm
      }
      lcm += max
    }
    return maxLcm
  }
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
