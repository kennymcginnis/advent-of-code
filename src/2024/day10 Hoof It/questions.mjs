import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split('').map(Number))

const neighbors = [
  [-1, 0], // top
  [0, -1], // left
  [0, 1], //  right
  [1, 0], //  bottom
]

const part1 = () => {
  let data = parseInput(sample)

  let queue = []
  let route = {}

  data.map((r, row) => r.map((value, col) => value === 9 && queue.push([{ row, col, value }])))

  while (queue.length) {
    let currentPath = queue.shift()
    let { row, col, value: current } = currentPath[0]
    for (let [r, c] of neighbors) {
      const value = data?.[row + r]?.[col + c]
      if (value === current - 1) {
        const path = [{ row: row + r, col: col + c, value }, ...currentPath]
        if (value === 0) {
          let nine = currentPath[currentPath.length - 1]
          if (route[`${row + r},${col + c}`]) route[`${row + r},${col + c}`][`${nine.row},${nine.col}`] = true
          else route[`${row + r},${col + c}`] = { [`${nine.row},${nine.col}`]: true }
        } else {
          queue.push(path)
        }
      }
    }
  }
  return Object.values(route).reduce((agg, cur) => agg + Object.keys(cur).length, 0)
}

const part2 = () => {
  let data = parseInput(input)

  let queue = []
  let route = {}

  data.map((r, row) => r.map((value, col) => value === 9 && queue.push([{ row, col, value }])))

  while (queue.length) {
    let currentPath = queue.shift()
    let { row, col, value: current } = currentPath[0]
    for (let [r, c] of neighbors) {
      const value = data?.[row + r]?.[col + c]
      if (value === current - 1) {
        const path = [{ row: row + r, col: col + c, value }, ...currentPath]
        if (value === 0) {
          if (route[`${row + r},${col + c}`]) route[`${row + r},${col + c}`].push(path)
          else route[`${row + r},${col + c}`] = [path]
        } else queue.push(path)
      }
    }
  }
  return Object.values(route).reduce((agg, cur) => agg + cur.length, 0)
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
