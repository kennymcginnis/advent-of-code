import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const directions = {
  n: [-1, 0],
  s: [1, 0],
  e: [0, 1],
  w: [0, -1],
}

const pipes = {
  '|': { n: 'n', s: 's' },
  '-': { e: 'e', w: 'w' },
  L: { s: 'e', w: 'n' },
  J: { s: 'w', e: 'n' },
  7: { e: 's', n: 'w' },
  F: { n: 'e', w: 's' },
  // '.': null,
  // S: null,
}

const part1 = () => {
  // let data = parseInput(sample)
  let data = parseInput(input)

  let tiled = Array.from({ length: 140 * 3 }).map(() => Array.from({ length: 140 * 3 }, () => '.'))
  function print() {
    console.log(tiled.map((x) => x.join('')).join('\n'))
  }

  let start = []
  for (let y in data) {
    if (data[y].indexOf('S') >= 0) {
      start = [+y, data[y].indexOf('S')]
    }
  }
  let [row, col] = start

  let ncol = 0
  let nrow = -1
  do {
    col += ncol
    row += nrow

    let c = data[row][col]
    tiled[3 * row + 1][3 * col + 1] = '*'
    tiled[3 * row + 1 - nrow][3 * col + 1 - ncol] = '*'
    if (c === 'J' || c === 'F') {
      ;[ncol, nrow] = [-nrow, -ncol]
    } else if (c === '7' || c === 'L') {
      ;[ncol, nrow] = [nrow, ncol]
    }
    tiled[3 * row + 1 + nrow][3 * col + 1 + ncol] = '*'
  } while (row !== start[0] || col !== start[1])
  print()

  const neighbors = [
    // [-1, -1], // top-left
    [-1, 0], //  top-middle
    // [-1, 1], //  top-right
    [0, -1], //  left
    // [0, 0], //   middle (self)
    [0, 1], //   right
    // [1, -1], //  bottom-left
    [1, 0], //   bottom-middle
    // [1, 1], //   bottom-right
  ]

  //bfs from corner to find all outside spots
  let queue = [[0, 0]]
  while (queue.length > 0) {
    let [row, col] = queue.pop()
    tiled[row][col] = ' '
    neighbors.forEach(([r, c]) => {
      if (tiled?.[row + r]?.[col + c] === '.') queue.push([row + r, col + c])
    })
  }
  print()

  let answer = 0
  for (let y = 1; y < 420; y += 3) {
    for (let x = 1; x < 420; x += 3) {
      if (tiled[y][x] === '.') answer++
    }
  }
  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
