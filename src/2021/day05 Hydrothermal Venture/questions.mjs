// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let vents = rawData.split('\n').map(l => l.replaceAll(' -> ', ',').split(',').map(Number))

const increment = (mapped, x, y) => {
  let coordinates = `${x},${y}`
  if (coordinates === '0,0') {
    console.log()
  }
  if (!mapped[coordinates]) mapped[coordinates] = 1
  else mapped[coordinates] += 1
}

const mapLines = part => {
  let mapped = {}
  vents.forEach(([x1, y1, x2, y2]) => {
    if (x1 === x2) {
      if (y1 < y2) {
        for (let y = y1; y <= y2; y++) increment(mapped, x1, y)
      } else {
        for (let y = y2; y <= y1; y++) increment(mapped, x1, y)
      }
    } else if (y1 === y2) {
      if (x1 < x2) {
        for (let x = x1; x <= x2; x++) increment(mapped, x, y1)
      } else {
        for (let x = x2; x <= x1; x++) increment(mapped, x, y1)
      }
    } else if (part === 2) {
      if (x1 < x2) {
        if (y1 < y2) {
          while (x1 <= x2) increment(mapped, x1++, y1++)
        } else {
          while (x1 <= x2) increment(mapped, x1++, y1--)
        }
      } else {
        if (y1 < y2) {
          while (x2 <= x1) increment(mapped, x1--, y1++)
        } else {
          while (x2 <= x1) increment(mapped, x1--, y1--)
        }
      }
    }
  })
  return mapped
}

const part1 = () => {
  const part = 1
  let mapped = mapLines(part)
  let answer = Object.values(mapped).filter(v => v > 1).length
  print(mapped)
  console.log({ part, answer })
}

const part2 = () => {
  const part = 2
  let mapped = mapLines(part)
  let answer = Object.values(mapped).filter(v => v > 1).length
  if (printing) print(mapped)
  console.log({ part, answer }) // < 20336
}

const print = mapped => {
  for (let row = 0; row < 10; row++) {
    let printing = ''
    for (let col = 0; col < 10; col++) {
      printing += mapped[`${col},${row}`] ? mapped[`${col},${row}`] : '.'
    }
    console.log(printing)
  }
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
