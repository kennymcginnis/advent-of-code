// import input from './small-sample1.mjs'
// import input from './sample1.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let queue = new Map()
const start = [0, 0]
const winds = new Map()
const directions = ['>', 'v', '<', '^']
const move = { '>': [0, 1], v: [1, 0], '<': [0, -1], '^': [-1, 0] }

const encodeOffset = (1 << 16) / 2
const encodePosition = ({ row, col }) => ((row + encodeOffset) << 16) | (col + encodeOffset)

let map, exit, rows, cols
const initBoard = () => {
  map = input
    .split('\n')
    .filter(Boolean)
    .map(r => r.split(''))

  map.shift()
  map.pop()
  map.forEach(r => {
    r.shift()
    r.pop()
  })

  rows = map.length
  cols = map[0].length
  exit = [rows - 1, cols - 1]

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] !== '.') addWind({ row, col, dir: map[row][col] })
    }
  }
}

const addWind = wind => {
  let id = encodePosition(wind)
  winds.set(id, { id, ...wind })
}

const blow = wind => {
  let { row, col } = wind
  let [r, c] = move[wind.dir]
  row = wind.row + r
  col = wind.col + c
  row = row < rows ? (row > -1 ? row : rows - 1) : 0
  col = col < cols ? (col > -1 ? col : cols - 1) : 0

  winds.set(wind.id, { ...wind, row, col })
}

const printBoard = () => {
  updateBoard()
  board.forEach(r => console.log(r.join('')))
}

let board
const updateBoard = () => {
  board = Array.from({ length: rows }, () => new Array(cols).fill('.'))
  for (let { row, col, dir } of winds.values()) {
    if (board[row][col] === '.') board[row][col] = dir
    else if (directions.includes(board[row][col])) board[row][col] = 2
    else board[row][col] += 1
  }
}

const moveWinds = () => {
  for (let wind of winds.values()) blow(wind)
  updateBoard()
}

const hasWind = ([row, col]) => board[row][col] !== '.'
const canMoveTo = ([fromRow, fromCol]) =>
  Object.values(move)
    .map(([r, c]) => [fromRow + r, fromCol + c])
    .filter(([toRow, toCol]) => board?.[toRow]?.[toCol] === '.' && !queue.has(`${toRow},${toCol}`))

const part1 = () => {
  let minute = 0
  let reachedGoal = false
  queue.set(start.toString(), start)

  initBoard()
  // console.log(`beginning map:`)
  // printBoard()
  while (!reachedGoal) {
    minute++
    moveWinds()
    // console.log(`map${minute}:`)
    // printBoard()

    const temp = new Map(queue)
    for (let pos of queue.values()) {
      let available = canMoveTo(pos)
      available.forEach(n => temp.set(n.toString(), n))
      if (temp.has(exit.toString())) {
        reachedGoal = true
        break
      }
      if (hasWind(pos)) temp.delete(pos.toString())
    }
    queue = new Map(temp)
  }
  console.log({ answer: minute + 1 })
}

timingMonitor()
part1()
console.log(timingMonitor())
