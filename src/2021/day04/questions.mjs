// import rawData from './sample.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let [numbers, ...rawBoards] = rawData.split('\n\n')
numbers = numbers.split(',').map(Number)

const initBoards = () => {
  return rawBoards.map(b => {
    return b
      .replaceAll('  ', ' ')
      .split('\n')
      .map(l =>
        l
          .trim()
          .split(' ')
          .map(i => ({
            number: Number(i),
            drawn: false,
          })),
      )
  })
}

let hasWinningBoard = false
let winningBoards = {}

const findFirstWinner = (boards, number) => {
  if (printing) console.log(`calling number: ${number}`)
  for (const b in boards) {
    const board = boards[b]
    for (const r in board) {
      const row = board[r]
      for (const c in board) {
        const item = row[c]
        if (item.number === number) {
          item.drawn = true
          if (searchForWinner(board, r, c)) {
            if (printing) console.log(`found a winner on board: ${b}`)
            hasWinningBoard = true
            return scoreBoard(board, number)
          }
        }
      }
    }
  }
}

const findLastWinner = (boards, number) => {
  if (printing) console.log(`calling number: ${number}`)
  for (const b in boards) {
    const board = boards[b]
    for (const r in board) {
      const row = board[r]
      for (const c in board) {
        const item = row[c]
        if (item.number === number) {
          item.drawn = true
          if (!winningBoards[b]) {
            if (searchForWinner(board, r, c)) {
              if (printing) console.log(`found a winner on board: ${b}`)
              winningBoards[b] = true
              if (Object.keys(winningBoards).length === boards.length) {
                hasWinningBoard = true
                return scoreBoard(board, number)
              }
            }
          }
        }
      }
    }
  }
}

const searchForWinner = (board, row, col) => {
  // Diagonals don't count
  let winner = false
  for (let r = 0; r < 5; r++) {
    if (!board[r][col].drawn) break
    if (r === 4) winner = true
  }
  if (!winner) {
    for (let c = 0; c < 5; c++) {
      if (!board[row][c].drawn) break
      if (c === 4) winner = true
    }
  }
  return winner
}

const scoreBoard = (winningBoard, winningNumber) => {
  let score = 0
  for (let row of winningBoard) {
    for (let item of row) {
      if (!item.drawn) score += item.number
    }
  }
  return score * winningNumber
}

const part1 = () => {
  let boards = initBoards()
  const part = 1
  hasWinningBoard = false
  let number = 0,
    answer
  while (!hasWinningBoard) {
    answer = findFirstWinner(boards, numbers[number])
    number++
  }
  console.log({ part, answer })
}

const part2 = () => {
  let boards = initBoards()
  const part = 2
  hasWinningBoard = false
  let number = 0,
    answer
  while (!hasWinningBoard) {
    answer = findLastWinner(boards, numbers[number])
    number++
  }
  console.log({ part, answer })
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
