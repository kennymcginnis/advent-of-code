// import rawData from './sample.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const data = rawData.split('\n').map(Number)
const length = data.length

const wrapAround = target => {
  // if (target < 0) target += length * Math.abs(Math.floor(target / length))
  // if (target >= length) target = target % length
  while (target >= length) target -= length
  while (target < 0) target += length
  return target
}

const mixing = (input, times) => {
  let output = [...input]
  let running = [...Array(times)].map(_ => {
    console.log('mixing')
    for (let number of input) {
      let index = output.indexOf(number)
      output.splice(index, 1)

      let target = index + number.value
      if (target < 0) target += output.length * Math.abs(Math.floor(target / output.length))
      if (target >= output.length) target = target % output.length

      output.splice(target, 0, number)
    }
  })
  return output.map(x => x.value)
}

const getResult = mixed => {
  let zero = mixed.indexOf(0)
  return [
    mixed[wrapAround(1000 + zero)],
    mixed[wrapAround(2000 + zero)],
    mixed[wrapAround(3000 + zero)],
  ].reduce((agg, cur) => agg + cur, 0)
}

const part1 = unmixed => {
  let mapped = unmixed.map(v => ({ value: v }))
  let mixed = mixing(mapped, 1)
  return getResult(mixed)
}

const part2 = unmixed => {
  let decoded = unmixed.map(v => ({ value: v * 811589153 }))
  let mixed = mixing(decoded, 10)
  return getResult(mixed)
}

const run = () => {
  let result1, result2

  timer = Date.now()
  result1 = part1([...data])
  console.log(timingMonitor())

  timer = Date.now()
  result2 = part2([...data])
  console.log(timingMonitor())

  console.log({ result1, result2 })
}

run()
