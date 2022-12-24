// import input from './small-sample.mjs'
// import input from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const entranceRow = 0
const entranceCol = 1
const entrance = [entranceRow, entranceCol]
const winds = new Map()
const directions = ['>', 'v', '<', '^']
const blizzard = { '>': [0, 1], v: [1, 0], '<': [0, -1], '^': [-1, 0], E: [0, 0] }

const encodeOffset = (1 << 16) / 2
const encodePosition = ([row, col]) => ((row + encodeOffset) << 16) | (col + encodeOffset)

let map, exit, exitRow, exitCol, rows, cols, board, workingQueue
const initBoard = () => {
  map = input
    .split('\n')
    .filter(Boolean)
    .map(r => r.split(''))

  rows = map.length
  cols = map[0].length
  exitRow = rows - 1
  exitCol = cols - 2
  exit = [exitRow, exitCol]

  for (let row = 1; row < rows; row++) {
    for (let col = 1; col < cols; col++) {
      let dir = map[row][col]
      if (directions.includes(dir)) {
        let id = encodePosition([row, col])
        winds.set(id, { id, row, col, dir })
      }
    }
  }
  updateBoard()
}

const updateBoard = () => {
  board = Array.from({ length: rows }, () => new Array(cols).fill('.'))
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if ([0, rows - 1].includes(row) || [0, cols - 1].includes(col)) board[row][col] = '#'
    }
  }
  board[entranceRow][entranceCol] = '.'
  board[exitRow][exitCol] = '.'

  for (let { row, col, dir } of winds.values()) {
    if (board[row][col] === '#') throw 'winds should not be in the boarder'
    else if (board[row][col] === '.') board[row][col] = dir
    else if (directions.includes(board[row][col])) board[row][col] = 2
    else board[row][col] += 1
  }
}

const blow = wind => {
  let { row, col } = wind
  let [r, c] = blizzard[wind.dir]
  row = wind.row + r
  col = wind.col + c
  row = row < rows - 1 ? (row > 0 ? row : rows - 2) : 1
  col = col < cols - 1 ? (col > 0 ? col : cols - 2) : 1

  winds.set(wind.id, { ...wind, row, col })
}

const moveWinds = () => {
  for (let wind of winds.values()) blow(wind)
  updateBoard()
}

const enqueue = pos => workingQueue.set(pos.toString(), pos)
const isAvailable = ([row, col]) =>
  board?.[row]?.[col] === '.' && !workingQueue.has([row, col].toString())
const availableMovements = ([fromRow, fromCol]) =>
  Object.values(blizzard)
    .map(([r, c]) => [fromRow + r, fromCol + c])
    .filter(isAvailable)

const moveElves = queue => {
  if (!queue.size) throw `no place to move or stand`
  workingQueue = new Map()
  for (let pos of queue.values()) availableMovements(pos).forEach(enqueue)
  return workingQueue
}

const navigation = (start, end) => {
  let queue = new Map()
  queue.set(start.toString(), start)

  let minutes = 0
  let reachedGoal = false
  while (!reachedGoal) {
    minutes++
    moveWinds()
    queue = moveElves(queue)
    if (queue.has(end.toString())) reachedGoal = true
  }
  return minutes
}

const part2 = () => {
  initBoard()

  let trip1 = navigation(entrance, exit)
  console.log(`trip1: ${trip1}`)
  let trip2 = navigation(exit, entrance)
  console.log(`trip2: ${trip2}`)
  let trip3 = navigation(entrance, exit)
  console.log(`trip3: ${trip3}`)
  let answer = trip1 + trip2 + trip3
  console.log({ answer })
}

timingMonitor()
part2()
console.log(timingMonitor())
