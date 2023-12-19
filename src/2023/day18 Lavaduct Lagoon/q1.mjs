import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((line) => {
    let [, dir, len, color] = /(.+) (\d+) \((.+)\)/.exec(line)
    return { dir, len, color }
  })

const directions = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
}

const neighbors = [
  [-1, 0], // top
  [0, -1], // left
  [0, 1], //  right
  [1, 0], //  bottom
]

const part1 = () => {
  let data = parseInput(input)

  let row = 0,
    col = 0,
    map = {}

  for (let line of data) {
    for (let i = 0; i < line.len; i++) {
      let [r, c] = directions[line.dir]
      ;[row, col] = [row + r, col + c]
      if (!map[row]) map[row] = { [col]: '#' }
      map[row][col] = '#'
    }
  }

  map[1][1] = '.'
  let queue = [[1, 1]]
  while (queue.length > 0) {
    let [row, col] = queue.pop()
    neighbors.forEach(([r, c]) => {
      let neighbor = map[row + r][col + c]
      if (!neighbor) {
        map[row + r][col + c] = '.'
        queue.push([row + r, col + c])
      }
    })
  }

  return Object.values(map).reduce((a, c) => a + Object.values(c).length, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
