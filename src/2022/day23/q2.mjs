// import input from './small-sample.mjs'
// import input from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let map = input.split('\n').map(r => r.split(''))
let board = Array.from({ length: 200 }, () => new Array(200).fill(false))

const elves = new Map()
const offset = 50
const encodeOffset = (1 << 16) / 2
const MIDDLE = 1
const directions = [
  // north
  [
    [-1, -1],
    [-1, 0],
    [-1, +1],
  ],
  // south
  [
    [+1, -1],
    [+1, 0],
    [+1, +1],
  ],
  // west
  [
    [-1, -1],
    [0, -1],
    [+1, -1],
  ],
  // east
  [
    [-1, +1],
    [0, +1],
    [+1, +1],
  ],
]

const initBoard = () => {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === '#') addElf([row, col])
    }
  }
}

const encodePosition = ([row, col]) => ((row + encodeOffset) << 16) | (col + encodeOffset)

const moveElf = ([to, from]) => {
  removeElf(from)
  addElf(to)
}
const addElf = ([row, col]) => {
  board[row + offset][col + offset] = true
  elves.set(encodePosition([row, col]), [row, col])
}
const removeElf = ([row, col]) => {
  board[row + offset][col + offset] = false
  elves.delete(encodePosition([row, col]))
}
const hasElf = ([row, col]) => board[row + offset][col + offset]
const target = (from, direction) => targetting(from, direction[MIDDLE]).toString()
const targetting = ([row, col], [r, c]) => [row + r, col + c]
const canMoveDirection = (from, dir) => dir.every(delta => !hasElf(targetting(from, delta)))
const noReasonToMove = from => directions.every(dir => canMoveDirection(from, dir))
const cantMoveAnyDirection = from => directions.every(dir => !canMoveDirection(from, dir))

const spread = firstDirection => {
  let proposedMoves = new Map() // to, from
  for (const from of elves.values()) {
    if (noReasonToMove(from) || cantMoveAnyDirection(from)) continue
    for (let dir = 0; dir < 4; dir++) {
      let direction = directions[(firstDirection + dir) % 4]
      if (canMoveDirection(from, direction)) {
        let to = target(from, direction)
        if (proposedMoves.has(to)) {
          proposedMoves.delete(to)
          break
        } else {
          proposedMoves.set(to, from)
          break
        }
      }
    }
  }
  for (let [target, from] of proposedMoves) {
    let to = target.split(',').map(Number)
    moveElf([to, from])
  }
  return proposedMoves.size
}

const part2 = () => {
  initBoard()
  let round = 0
  let moves = 'Infinity'
  while (moves > 0) {
    moves = spread(round)
    round++
  }
  console.log(round)
}

timingMonitor()
part2()
console.log(timingMonitor())