import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((row) => row.split(''))

const right = { row: 0, col: 1, dir: 'right' }
const up = { row: -1, col: 0, dir: 'up' }
const down = { row: 1, col: 0, dir: 'down' }
const left = { row: 0, col: -1, dir: 'left' }

let step = {
  right: { '.': [right], '-': [right], '/': [up], ')': [down], '|': [up, down] },
  down: { '.': [down], '|': [down], '/': [left], ')': [right], '-': [left, right] },
  left: { '.': [left], '-': [left], '/': [down], ')': [up], '|': [up, down] },
  up: { '.': [up], '|': [up], '/': [right], ')': [left], '-': [right, left] },
}

const part1 = () => {
  let data = parseInput(input)

  let map = {}
  for (let row in data) {
    for (let col in data[row]) {
      map[[row, col]] = { value: data[row][col], visited: {}, energized: false }
    }
  }

  let queue = [{ row: 0, col: 0, dir: 'right' }]
  while (queue.length) {
    let { row, col, dir } = queue.shift()
    let cell = map[[row, col]]
    if (!cell) continue // off the map
    if (cell.visited[dir]) continue // traversed same path already
    console.log({ row, col, dir, cell })
    cell.energized = true
    cell.visited[dir] = true
    step[dir][cell.value].forEach((d) =>
      queue.push({ row: row + d.row, col: col + d.col, dir: d.dir }),
    )
  }
  return Object.values(map).reduce((a, c) => a + (c.energized ? 1 : 0), 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
