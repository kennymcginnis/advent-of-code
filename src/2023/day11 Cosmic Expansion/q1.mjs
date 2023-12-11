import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const part1 = () => {
  let data = parseInput(input)
  // print()

  // find empty columns
  for (let col = 0; col < data[0].length; col++) {
    let empty = true
    for (let row = 0; row < data.length; row++) {
      if (data[row][col] === '#') {
        empty = false
        break
      }
    }
    if (empty) {
      for (let row = 0; row < data.length; row++) {
        data[row].splice(col, 0, '.')
      }
      col++
    }
  }
  // print()

  // find empty rows
  for (let row = 0; row < data.length; row++) {
    let empty = true
    for (let col = 0; col < data[row].length; col++) {
      if (data[row][col] === '#') {
        empty = false
        break
      }
    }
    if (empty) {
      data.splice(row, 0, Array(data[row].length).fill('.'))
      row++
    }
  }
  print()

  let galaxy = 0
  let positions = {}
  for (let row in data) {
    for (let col in data[row]) {
      if (data[row][col] === '.') continue
      data[row][col] = galaxy
      positions[galaxy] = [row, col]
      galaxy++
    }
  }

  let galaxies = {}
  for (let x = 0; x < galaxy; x++) {
    for (let y = x + 1; y < galaxy; y++) {
      let [x1, y1] = positions[x]
      let [x2, y2] = positions[y]
      let dx = Math.abs(x2 - x1)
      let dy = Math.abs(y2 - y1)
      galaxies[`${x},${y}`] = dx + dy
    }
  }

  // print()
  function print() {
    for (let row of data) {
      console.log(row.join(''))
    }
  }
  return Object.values(galaxies).reduce((a, b) => a + b)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
