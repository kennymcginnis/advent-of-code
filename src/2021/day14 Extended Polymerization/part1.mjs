// import rawData from './sample1.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let [polymerTemplate, pairInsertion] = rawData.split('\n\n')
polymerTemplate = polymerTemplate.split('')
pairInsertion = pairInsertion.split('\n').map(l => {
  let [p, insert] = l.split(' -> ')
  let pair = p.split('')
  return { pair, insert }
})

const insert = input => {
  let inserts = []
  let output = [...input]
  for (let { pair, insert } of pairInsertion) {
    for (let index = 1; index < input.length; index++) {
      if (input[index - 1] === pair[0] && input[index] === pair[1]) {
        inserts.push({ index, insert })
      }
    }
  }
  inserts.sort((a, b) => b.index - a.index)
  for (let { index, insert } of inserts) output.splice(index, 0, insert)
  return output
}

const score = input => {
  let map = {}
  for (let p of input) {
    if (map[p]) map[p] += 1
    else map[p] = 1
  }

  let values = Object.values(map)
    .map(Number)
    .sort((a, b) => a - b)

  return values[values.length - 1] - values[0]
}

const part1 = () => {
  const part = 1

  let polymer = [...polymerTemplate]
  let step = 0
  console.log(`Template:     ${polymer.join('')}`)

  while (step < 10) {
    step++
    polymer = insert(polymer)
    if (step < 5) {
      console.log(`After step ${step}: ${polymer.join('')}`)
    } else {
      console.log(`After step ${step}: Length: ${polymer.length}`)
    }
  }

  // taking the quantity of the most common element (B, 1749) and subtracting the quantity of the least common element (H, 161)
  let answer = score(polymer)
  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())
}

run()
