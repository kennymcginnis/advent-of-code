import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const move = { '>': [0, 1], v: [1, 0], '<': [0, -1], '^': [-1, 0] }
const rotate = {
  L: { '>': '^', v: '>', '<': 'v', '^': '<' },
  R: { '>': 'v', v: '<', '<': '^', '^': '>' },
}

const printBoard = (board) => {
  for (let row of board) console.log(row.join(''))
}

const parseInput = (input) => {
  const output = input.split('\n').map((line) => ['*', ...line.split(''), '*'])
  const border = Array(output[0].length).fill('*')
  return [border, ...output, border]
}

const part1 = () => {
  let printing = false

  let data = parseInput(input)

  let position = [46, 43]
  // let position = [7, 5]

  let inboard = true
  while (inboard) {
    const [curr_row, curr_col] = position

    // if facing an obstacle, rotate until free
    let facing = data[curr_row][curr_col]
    let [next_row, next_col] = move[facing]
    while (data[curr_row + next_row][curr_col + next_col] === '#') {
      facing = rotate.R[facing]
      ;[next_row, next_col] = move[facing]
    }

    // update current with X
    data[curr_row][curr_col] = 'X'

    // have we exited the map
    if (data[curr_row + next_row][curr_col + next_col] === '*') {
      inboard = false
    } else {
      // update next position with direction facing
      data[curr_row + next_row][curr_col + next_col] = facing

      // move position forward
      position = [curr_row + next_row, curr_col + next_col]
    }

    if (printing) printBoard(data)
  }
  return data.reduce((agg, cur) => agg + cur.filter((c) => c === 'X').length, 0)
}

const part2 = () => {
  let original = parseInput(input)

  const answers = {}
  for (let row in original) {
    for (let col in original[row]) {
      answers[`${row},${col}`] = { row, col, exits: false, loops: false }
    }
  }

  for (let [key, { row, col }] of Object.entries(answers)) {
    // skip boarders
    if (original[row][col] === '*') continue
    // skip starting point
    if (row === '46' && col === '43') continue

    // place random object
    let data = original.map((row) => row.map((col) => ({ value: col, visited: [] })))
    data[row][col].value = '#'

    let position = [46, 43]

    let inboard = true
    while (inboard) {
      const [curr_row, curr_col] = position

      // if facing an obstacle, rotate until free
      let facing = data[curr_row][curr_col].value
      let [next_row, next_col] = move[facing]
      while (data[curr_row + next_row][curr_col + next_col].value === '#') {
        facing = rotate.R[facing]
        ;[next_row, next_col] = move[facing]
      }

      // update current with X
      data[curr_row][curr_col].value = 'X'

      // have we exited the map
      if (data[curr_row + next_row][curr_col + next_col].value === '*') {
        inboard = false
      } else {
        // have we looped
        if (data[curr_row + next_row][curr_col + next_col].visited.includes(facing)) {
          answers[key].loops = true
          break
        } else {
          data[curr_row + next_row][curr_col + next_col].visited.push(facing)
        }

        // update next position with direction facing
        data[curr_row + next_row][curr_col + next_col].value = facing

        // move position forward
        position = [curr_row + next_row, curr_col + next_col]
      }
    }
    if (!answers[key].loops && !inboard) answers[key].exits = true
  }

  return Object.values(answers).filter((a) => a.loops).length
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
