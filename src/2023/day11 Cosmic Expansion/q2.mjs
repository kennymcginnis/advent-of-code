import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const part2 = () => {
  let data = parseInput(input)

  let emptyRows = new Set()
  let emptyCols = new Set()
  let galaxies = []

  data.forEach((row, r) => {
    if (row.every((c) => c === '.')) {
      emptyRows.add(r)
    }
  })

  for (let c = 0; c < data[0].length; c++) {
    if (data.every((row) => row[c] === '.')) {
      emptyCols.add(c)
    }
  }

  // find the galaxies
  data.forEach((row, r) => {
    row.forEach((col, c) => {
      if (col === '#') {
        galaxies.push({ r, c })
      }
    })
  })

  // console.log({galaxies})
  // console.log({emptyRows})
  // console.log({emptyCols})

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

  let multiplier = 1000000
  let sumOfDistances = 0
  for (let g in galaxies) {
    let galaxy = galaxies[g]
    for (let o = +g + 1; o < galaxies.length; o++) {
      let other = galaxies[o]
      let distance = Math.abs(galaxy.r - other.r) + Math.abs(galaxy.c - other.c)

      let emptyRow = 0
      for (let r = Math.min(galaxy.r, other.r) + 1; r < Math.max(galaxy.r, other.r); r++) {
        if (emptyRows.has(r)) emptyRow++
      }

      let emptyCol = 0
      for (let c = Math.min(galaxy.c, other.c) + 1; c < Math.max(galaxy.c, other.c); c++) {
        if (emptyCols.has(c)) emptyCol++
      }

      distance += (emptyRow + emptyCol) * (multiplier - 1)
      // console.log(galaxy, other, distance)
      sumOfDistances += distance
    }
  }
  return sumOfDistances
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
