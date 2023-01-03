// import input from './small-sample.mjs'
// import input from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let map = input.split('\n').map(r => r.split(''))
let board = Array.from({ length: 200 }, () => new Array(200).fill(false))

const elves = new Map()
const offset = 10
const encodeOffset = (1 << 16) / 2
const MIDDLE = 1
const cardinal = ['north', 'south', 'west', 'east']
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

const spread = round => {
  let proposedMoves = new Map() // to, from
  for (const from of elves.values()) {
    if (noReasonToMove(from) || cantMoveAnyDirection(from)) continue
    for (let dir = 0; dir < 4; dir++) {
      let direction = directions[(round + dir) % 4]
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
}

let minRow, minCol, maxRow, maxCol
const smallestRectangle = () => {
  ;(minRow = 'Infinity'), (minCol = 'Infinity'), (maxRow = 0), (maxCol = 0)
  for (const [row, col] of elves.values()) {
    if (row < minRow) minRow = row
    if (row > maxRow) maxRow = row
    if (col < minCol) minCol = col
    if (col > maxCol) maxCol = col
  }
}
const emptyGroundTiles = () => (maxRow - minRow + 1) * (maxCol - minCol + 1) - elves.size

const printBoard = () => {
  smallestRectangle()
  for (let row = minRow; row <= maxRow; row++) {
    let printer = ''
    for (let col = minCol; col <= maxCol; col++) {
      printer += hasElf([row, col]) ? '#' : '.'
    }
    console.log(printer)
  }
}

const printDirections = dir => {
  console.log(
    `
move ${cardinal[dir % 4]},${cardinal[(dir + 1) % 4]},${cardinal[(dir + 2) % 4]},${
      cardinal[(dir + 3) % 4]
    }`,
  )
}

const part1 = () => {
  initBoard()
  console.log(`beginning map: (${elves.size}elves)`)
  printBoard()
  printDirections(0)
  for (let round = 0; round < 10; round++) {
    spread(round)
    console.log(`round ${round + 1} map:`)
    printBoard()
    printDirections(round)
  }
  smallestRectangle()
  console.log(emptyGroundTiles()) // 3769 > x < 3929
}

timingMonitor()
part1()
timingMonitor()
