// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let [coordinates, folds] = rawData.split('\n\n')
coordinates = coordinates.split('\n').map(l => l.split(',').map(Number))
folds = folds
  .replaceAll('fold along ', '')
  .split('\n')
  .map(l => l.split('='))

const print = board => {
  console.log('')
  for (let row of board) console.log(row.join(''))
}

const initBoard = data => {
  let maxX = 0,
    maxY = 0
  for (let [x, y] of data) {
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  let board = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill('.'))
  for (let [x, y] of data) board[y][x] = '#'
  return board
}

const folding = (board, dir, index) => {
  if (dir === 'y') {
    for (let y = 0; y <= index; y++) {
      for (let x = 0; x < board[0].length; x++) {
        if (board[index + y][x] === '#') {
          board[index - y][x] = '#'
        }
      }
    }
    board = board.splice(0, index)
  }
  if (dir === 'x') {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x <= index; x++) {
        if (board[y][index + x] === '#') {
          board[y][index - x] = '#'
        }
      }
      board[y] = board[y].splice(0, index)
    }
  }
  return board
}

const part1 = () => {
  const part = 1

  let board = initBoard(coordinates)
  if (printing) print(board)

  let [dir, index] = folds[0]
  board = folding(board, dir, Number(index))
  if (printing) print(board)

  let answer = board.flat().reduce((a, c) => {
    if (c === '#') a += 1
    return a
  }, 0)
  console.log({ part, answer })
}

const part2 = () => {
  const part = 2

  let board = initBoard(coordinates)
  if (printing) print(board)

  for (let [dir, index] of folds) {
    board = folding(board, dir, Number(index))
    if (printing) print(board)
  }
  print(board)
  console.log({ part })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
