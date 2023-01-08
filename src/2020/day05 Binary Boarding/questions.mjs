import sample from './sample.mjs'
import input from './input.mjs'

let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(r => r.split(''))

const divide = (keep, [min, max]) => {
  if (printing) console.log({ min, max })
  let half = (max - min + 1) / 2
  if (keep === 'F' || keep === 'L') max -= half
  else min += half
  return min === max ? min : [min, max]
}

const seating = data => {
  return data.map(pass => {
    let rows = pass.slice(0, 7),
      cols = pass.slice(7),
      min = 0,
      max = 127
    let row = rows.reduce(([min, max], curr) => divide(curr, [min, max]), [min, max])

    min = 0
    max = 7
    let col = cols.reduce(([min, max], curr) => divide(curr, [min, max]), [min, max])
    return row * 8 + col
  })
}

const part1 = () => {
  let data = parseInput(input)
  let seats = seating(data)
  return seats.reduce((a, c) => (c > a ? c : a), 0)
}

const part2 = () => {
  let data = parseInput(input)
  let seats = seating(data)
    .sort((a, b) => a - b)
    .reduce((a, c) => ((a[c] = c), a), {})
  let first = Number(Object.keys(seats).shift())
  let last = Number(Object.keys(seats).pop())
  for (let s = first + 1; s <= last - 1; s++) {
    if (!seats[s]) return s
  }
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
