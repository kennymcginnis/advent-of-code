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

const part2 = () => {
  let data = parseInput(input)

  function energize(queue) {
    let map = {}
    for (let row in data) {
      for (let col in data[row]) {
        map[[row, col]] = { value: data[row][col], visited: {}, energized: false }
      }
    }

    while (queue.length) {
      let { row, col, dir } = queue.shift()
      let cell = map[[row, col]]
      if (!cell) continue // off the map
      if (cell.visited[dir]) continue // traversed same path already
      // console.log({ row, col, dir, cell })
      cell.energized = true
      cell.visited[dir] = true
      step[dir][cell.value].forEach((d) =>
        queue.push({ row: row + d.row, col: col + d.col, dir: d.dir }),
      )
    }
    return Object.values(map).reduce((a, c) => a + (c.energized ? 1 : 0), 0)
  }

  let last = data.length - 1
  let answer = 0
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      let energized = 0
      if (row === 0) {
        energized = energize([{ row, col, dir: 'down' }])
        if (energized > answer) answer = energized
      }
      if (col === 0) {
        energized = energize([{ row, col, dir: 'right' }])
        if (energized > answer) answer = energized
      }
      if (row === last) {
        energized = energize([{ row, col, dir: 'up' }])
        if (energized > answer) answer = energized
      }
      if (col === last) {
        energized = energize([{ row, col, dir: 'left' }])
        if (energized > answer) answer = energized
      }
    }
  }
  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
