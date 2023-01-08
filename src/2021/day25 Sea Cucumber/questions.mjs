import sample from './sample.mjs'
import input from './input.mjs'

let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let rows, cols
const parseInput = input => {
  let output = input.split('\n').map(r => r.split(''))
  rows = output.length
  cols = output[0].length
  return output
}

const wrapped = (cur, max) => (cur + 1) % max

const moveRight = input => {
  let moved = false
  let output = {}
  for (let row = 0; row < rows; row++) {
    output[row] = {}
    for (let col = 0; col < cols; col++) {
      const next = wrapped(col, cols)
      // right -> left, top -> bottom
      // for (let col = cols - 1; col > 0; col--) {
      if (input[row][col] === '>' && input[row][next] === '.') {
        if (!moved) moved = true
        output[row][col] = '.'
        output[row][next] = '>'
      } else if (!output[row][col]) {
        output[row][col] = input[row][col]
      }
    }
  }
  return [moved, output]
}

const moveDown = input => {
  let moved = false
  let output = {}
  // right -> left, top -> bottom
  // for (let row = rows - 1; row > 0; row--) {
  for (let row = 0; row < rows; row++) {
    const next = wrapped(row, rows)
    if (!output[row]) output[row] = {}
    if (!output[next]) output[next] = {}
    for (let col = 0; col < cols; col++) {
      if (input[row][col] === 'v' && input[next][col] === '.') {
        if (!moved) moved = true
        output[row][col] = '.'
        output[next][col] = 'v'
      } else if (!output[row][col]) {
        output[row][col] = input[row][col]
      }
    }
  }
  return [moved, output]
}

const printBoard = (input, movements) => {
  if (movements === 0) console.log('Initial state:')
  else console.log(`After ${movements} step${movements === 1 ? '' : 's'}:`)
  if (input.constructor === Array) input.forEach(r => console.log(r.join('')))
  else Object.values(input).forEach(r => console.log(Object.values(r).join('')))
  console.log('')
}

const part1 = () => {
  let data = parseInput(input)
  let movements = 0
  let moving = true
  while (moving) {
    if (printing) printBoard(data, movements)
    movements++
    let [movedRight, dataRight] = moveRight(data)
    let [movedDown, dataLeft] = moveDown(dataRight)
    moving = movedRight || movedDown
    data = dataLeft
  }
  return movements
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
