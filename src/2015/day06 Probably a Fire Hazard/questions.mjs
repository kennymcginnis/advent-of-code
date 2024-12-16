import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const splitter = /(turn on|turn off|toggle)\s*(\d*),(\d*)\D*(\d*),(\d*)/g
  return input.split('\n').map((r) => {
    let [_, command, r1, c1, r2, c2] = [...r.matchAll(splitter)][0]
    return { command, from: { row: Number(r1), col: Number(c1) }, to: { row: Number(r2), col: Number(c2) } }
  })
}
const part1 = (data) => {
  let grid = Array(1000)
    .fill()
    .map(() => Array(1000).fill(false))

  for (let row of data) {
    let { command, from, to } = row
    for (let r = from.row; r <= to.row; r++) {
      for (let c = from.col; c <= to.col; c++) {
        switch (command) {
          case 'turn on':
            grid[r][c] = true
            break
          case 'turn off':
            grid[r][c] = false
            break
          case 'toggle':
            grid[r][c] = !grid[r][c]
            break
        }
      }
    }
  }
  return grid.flat().filter((v) => v).length
}

const part2 = (data) => {
  let grid = Array(1000)
    .fill()
    .map(() => Array(1000).fill(0))

  for (let row of data) {
    let { command, from, to } = row
    for (let r = from.row; r <= to.row; r++) {
      for (let c = from.col; c <= to.col; c++) {
        switch (command) {
          case 'turn on':
            grid[r][c]++
            break
          case 'turn off':
            grid[r][c] = Math.max(0, grid[r][c] - 1)
            break
          case 'toggle':
            grid[r][c] += 2
            break
        }
      }
    }
  }
  return grid.flat().reduce((a, b) => a + b)
}

const run = () => {
  let data = parseInput(input)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
