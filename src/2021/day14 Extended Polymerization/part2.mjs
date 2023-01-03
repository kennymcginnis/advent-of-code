// import rawData from './sample.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let [polymerTemplate, pairInsertion] = rawData.split('\n\n')
pairInsertion = pairInsertion.split('\n').map(l => {
  let [pair, insert] = l.split(' -> ')
  return { pair, insert }
})

const add = (map, key, plus) => {
  if (map[key]) map[key] += plus
  else map[key] = plus
}

const initCounters = polymer => {
  let counts = {}

  for (let { pair, insert } of pairInsertion) {
    let [l, r] = [...pair]
    let left = l + insert
    let right = insert + r
    counts[left] = 0
    counts[right] = 0
  }

  for (let index = 0; index < polymer.length - 1; index++) {
    let pair = polymer.substring(index, index + 2)
    if (counts[pair]) counts[pair] += 1
    else counts[pair] = 1
  }

  return counts
}

const insert = input => {
  let output = { ...input }
  for (let { pair, insert } of pairInsertion) {
    let count = input[pair]
    if (!count) continue
    let [l, r] = [...pair]
    let left = l + insert
    let right = insert + r
    output[pair] -= count
    output[left] += count
    output[right] += count
  }
  return output
}

const score = input => {
  let map = {}

  for (let [pair, value] of Object.entries(input)) {
    let [left, right] = [...pair]
    add(map, left, value)
    add(map, right, value)
  }

  let values = Object.values(map)
    .map(Number)
    .sort((a, b) => a - b)

  return Math.round(values[values.length - 1] / 2) - Math.round(values[0] / 2)
}

const part2 = () => {
  const part = 2

  let polymer = polymerTemplate
  let counts = initCounters(polymer)

  let step = 0
  while (step < 40) {
    step++
    counts = insert(counts)
  }
  let answer = score(counts)
  console.log({ part, answer })
}

const run = () => {
  timingMonitor()
  part2()
  console.log(timingMonitor())
}

run()
