// import rawData from './small-sample1.mjs'
// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, -1], // top-left
  [-1, 0], //  top-middle
  [-1, 1], //  top-right
  [0, -1], //  left
  // [0, 0], //   middle (self)
  [0, 1], //   right
  [1, -1], //  bottom-left
  [1, 0], //   bottom-middle
  [1, 1], //   bottom-right
]

const print = (board, step) => {
  if (!printing) return
  if (step > 10 && step % 10 !== 0) return
  console.log(`
After step ${step}:`)
  for (let row of board) console.log(row.join(''))
}

const key = coor => coor.toString()

function increment(data, flashed, row, col, spread) {
  if (data[row][col] === 9) {
    data[row][col] = 0
    flashed.set(key([row, col]), [row, col])
    if (spread) increaseNeighbors(data, flashed, row, col)
  } else data[row][col] += 1
}

function increaseAll(data, flashed) {
  for (let row in data) {
    for (let col in data[row]) {
      increment(data, flashed, Number(row), Number(col), false)
    }
  }
  let original = new Map(flashed)
  for (let [row, col] of original.values()) increaseNeighbors(data, flashed, row, col)
  return flashed.size
}

function increaseNeighbors(data, flashed, row, col) {
  for (let [r, c] of neighbors) {
    if (!data?.[row + r]?.[col + c] || flashed.has(key([row + r, col + c]))) continue
    increment(data, flashed, row + r, col + c, true)
  }
}

function synchronized(data) {
  return data.flat().every(v => v === 0)
}

const part1 = () => {
  const part = 1

  let data = rawData.split('\n').map(l => l.split('').map(Number))

  let step = 0
  let answer = 0
  print(data, step)
  while (step < 100) {
    step++
    answer += increaseAll(data, new Map())
    print(data, step)
  }

  console.log({ part, answer })
}

const part2 = () => {
  const part = 2

  let data = rawData.split('\n').map(l => l.split('').map(Number))

  let answer = 0
  print(data, answer)
  while (!synchronized(data)) {
    answer++
    increaseAll(data, new Map())

    print(data, answer)
  }

  console.log({ part, answer })
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
