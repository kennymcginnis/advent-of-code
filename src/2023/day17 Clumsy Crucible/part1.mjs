import sample from './sample.mjs'
import input from './input.mjs'
import { Heap } from 'heap-js'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, 0], // top
  [0, 1], //  right
  [1, 0], //  bottom
  [0, -1], // left
]

const part1 = () => {
  const map = input.split('\n').map((line) => line.split('').map(Number))

  class Visited {
    visited = new Set()
    constructor(minSteps, maxSteps) {
      this.minSteps = minSteps
      this.maxSteps = maxSteps
    }
    check({ row, col, rowDir, colDir, consecutive }) {
      const key =
        (row << 24) | (col << 16) | ((rowDir & 3) << 14) | ((colDir & 3) << 12) | consecutive
      if (this.visited.has(key)) return true
      if (consecutive >= this.minSteps)
        for (let i = 0; i <= this.maxSteps - consecutive; ++i) this.visited.add(key + i)
      else this.visited.add(key)
      return false
    }
  }

  function tryDirection(positions, pos, row, col) {
    const nextRow = pos.row + row
    const nextCol = pos.col + col
    const sameDirection = row === pos.rowDir && col === pos.colDir

    // Boundary check
    if (nextRow < 0 || nextRow >= map.length || nextCol < 0 || nextCol >= map[0].length) return
    // Backwards check
    if (row === -pos.rowDir && col === -pos.colDir) return
    // Max steps check
    if (pos.consecutive === 3 && sameDirection) return

    positions.push({
      row: nextRow,
      col: nextCol,
      rowDir: row,
      colDir: col,
      consecutive: sameDirection ? pos.consecutive + 1 : 1,
      heat: pos.heat + map[nextRow][nextCol],
    })
  }

  function minHeat() {
    const positions = new Heap((a, b) => a.heat - b.heat)
    const visited = new Visited()
    positions.push({ row: 0, col: 0, rowDir: 0, colDir: 0, consecutive: 0, heat: 0 })
    while (positions.length > 0) {
      const pos = positions.pop()
      if (visited.check(pos)) continue
      if (pos.row === map.length - 1 && pos.col === map[0].length - 1) return pos.heat
      neighbors.forEach(([row, col]) => tryDirection(positions, pos, row, col))
    }
  }

  return minHeat()
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
