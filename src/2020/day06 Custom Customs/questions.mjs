import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let data = input.split('\n\n').map(g => new Set([...g.replaceAll('\n', '')]))
  return data.reduce((a, c) => ((a += c.size), a), 0)
}

const part2 = () => {
  let data = input.split('\n\n').map(g => new Set([...g.replaceAll('\n', '')]))
  let groups = input.split('\n\n').map(group => group.split('\n'))

  return groups
    .map((group, g) => [...data[g].keys()].filter(k => group.every(line => line.includes(k))))
    .reduce((a, c) => ((a += c.length), a), 0)
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
