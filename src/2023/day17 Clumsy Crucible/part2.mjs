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

const part2 = () => {
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

  function tryDirection(positions, pos, rowDir, colDir, minSteps, maxSteps) {
    const nextRow = pos.row + rowDir
    const nextCol = pos.col + colDir
    const sameDirection = rowDir === pos.rowDir && colDir === pos.colDir

    // Boundary check
    if (nextRow < 0 || nextRow >= map.length || nextCol < 0 || nextCol >= map[0].length) return
    // Backwards check
    if (rowDir === -pos.rowDir && colDir === -pos.colDir) return
    // Max steps check
    if (pos.consecutive === maxSteps && sameDirection) return
    // Min steps check
    if (pos.consecutive < minSteps && !sameDirection && !(pos.row === 0 && pos.col === 0)) return

    positions.push({
      row: nextRow,
      col: nextCol,
      rowDir,
      colDir,
      consecutive: sameDirection ? pos.consecutive + 1 : 1,
      heat: pos.heat + map[nextRow][nextCol],
    })
  }

  function minHeat(minSteps, maxSteps) {
    const positions = new Heap((a, b) => a.heat - b.heat)
    const visited = new Visited(minSteps, maxSteps)
    positions.push({ row: 0, col: 0, rowDir: 0, colDir: 0, consecutive: 0, heat: 0 })
    while (positions.length > 0) {
      const pos = positions.pop()
      if (visited.check(pos)) continue
      if (
        pos.row === map.length - 1 &&
        pos.col === map[0].length - 1 &&
        pos.consecutive >= minSteps
      )
        return pos.heat
      neighbors.forEach(([row, col]) => tryDirection(positions, pos, row, col, minSteps, maxSteps))
    }
  }

  return minHeat(4, 10)
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
