import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(''))

const move = {
  '>': [0, 1],
  v: [1, 0],
  '<': [0, -1],
  '^': [-1, 0],
}
const excluded = {
  '>': [0, -1],
  v: [-1, 0],
  '<': [0, 1],
  '^': [1, 0],
}
const neighbors = [
  [-1, 0], // top
  [0, 1], //  right
  [1, 0], //  bottom
  [0, -1], // left
]

const part1 = (input) => {
  let map = parseInput(input)

  const start = [0, 1]
  const rows = map.length
  const cols = map[0].length
  map[rows - 1][cols - 2] = 'X' // exit

  let longest = 0
  let queue = [{ position: start, path: [start.toString()] }]

  function print(path) {
    let printer = Array(rows)
      .fill()
      .map(() => Array(cols))

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        printer[row][col] = path.includes([row, col].toString()) ? 'O' : map[row][col]
      }
      console.log(printer[row].join(''))
    }
  }

  while (queue.length > 0) {
    let { position, path } = queue.pop()
    let [row, col] = position

    for (const [r, c] of neighbors) {
      let neighbor = map?.[row + r]?.[col + c]
      let next = [row + r, col + c]
      if (path.includes(next.toString())) continue
      switch (neighbor) {
        case '.':
          queue.push({ position: next, path: [...path, next.toString()] })
          break
        case '>':
        case 'v':
        case '<':
        case '^':
          let [excludeRow, excludeCol] = excluded[neighbor]
          if (r === excludeRow && c === excludeCol) continue

          let [extraRow, extraCol] = move[neighbor]
          let slide = [row + r + extraRow, col + c + extraCol]
          queue.push({
            position: slide,
            path: [...path, next.toString(), slide.toString()],
          })
          break
        case 'X':
          if (path.length + 1 > longest) {
            console.log(path.length)
            print(path)
            longest = path.length
          }
          break
        default:
          break
      }
    }
  }
  return longest
}

const run = () => {
  timer = Date.now()
  let answer = part1(sample)
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
