import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const neighbors = {
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

const directions = ['n', 's', 'e', 'w']

const part1 = () => {
  // let data = parseInput(sample)
  let data = parseInput(input)
  let answer = false

  let row,
    col,
    direction,
    directionIndex = -1,
    steps

  function turn() {
    row = 115
    col = 40
    steps = 1
    directionIndex++
    direction = directions[directionIndex % 4]
  }

  turn()
  while (!answer) {
    // console.log({ location: data[row][col], row, col, direction, steps })

    let [r, c] = neighbors[direction]
    let neighbor = data[row + r][col + c]
    if (neighbor === 'S') return steps / 2

    let dir = pipes[neighbor]?.[direction]
    if (dir) {
      steps++
      row += r
      col += c
      direction = dir
    } else {
      turn()
    }
  }

  return answer / 2
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
