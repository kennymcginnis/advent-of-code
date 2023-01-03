// import rawData from './sample.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const positions = rawData.split(',').map(Number)
const sorted = Array.from(positions).sort((a, b) => a - b)
const mapped = () =>
  positions.reduce((a, i) => {
    if (a[i]) a[i] += 1
    else a[i] = 1
    return a
  }, {})

const part1 = () => {
  const part = 1
  let map = mapped()

  function median() {
    const middle = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) return (sorted[middle - 1] + sorted[middle]) / 2
    return sorted[middle]
  }

  let middle = median()
  let answer = 0
  for (let pos in map) {
    let count = map[pos]
    answer += Math.abs(Number(pos) - middle) * count
  }

  console.log({ part, answer })
}

const part2 = () => {
  const part = 2
  let map = mapped()

  let min = sorted[0],
    max = sorted[sorted.length - 1],
    //starting in the middle
    start = Math.floor((max - min) / 2),
    answer = 'Infinity',
    totals = {}

  function fuel(moveTo) {
    let fuel = 0
    for (let pos in map) {
      let count = map[pos]
      let diff = Math.abs(Number(pos) - moveTo)
      fuel += (((1 + diff) * diff) / 2) * count
    }
    return fuel
  }

  function calc(pos) {
    if (totals[pos]) return totals[pos]
    let total = fuel(pos)
    totals[pos] = total
    if (total < answer) answer = total
    return total
  }

  calc(start)
  // move from the middle toward the min until the fuel costs increase
  for (let i = 0; i < start; i++) {
    let less = start - i
    let response = calc(less)
    if (response > answer) break
  }
  // move from the middle toward the max until the fuel costs increase
  for (let i = 0; i < start; i++) {
    let more = start + i
    let response = calc(more)
    if (response > answer) break
  }

  console.log({ part, answer }) // < 102969278
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
