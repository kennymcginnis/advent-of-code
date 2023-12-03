import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(r => r.split(''))

const isNumeric = string => !isNaN(string)

const neighbors = [
  [-1, -1], // top-left
  [-1, 0], //  top-middle
  [-1, 1], //  top-right
  [0, -1], //  left
  // [0, 0], //   middle (self)
  [0, 1], //   right
  [1, -1], //  bottom-left
  [1, 0], //   bottom-middle
  [1, 1], //   bottom-right
]

const symbolAdjacent = (data, row, col) =>
  neighbors.some(([r, c]) =>
    data?.[row + r]?.[col + c] !== undefined &&
    data[row + r][col + c] !== '.' &&
    !isNumeric(data[row + r][col + c]))

const part1 = () => {
  let data = parseInput(input)
  let partNumbers = []
  let curr = ''
  let foundSymbol = false

  function addPartNumber() {
    if (foundSymbol) partNumbers.push(curr)
    resetTracker()
  }

  function resetTracker() {
    curr = ''
    foundSymbol = false
  }

  for (let row in data) {
    resetTracker()
    for (let col in data[+row]) {
      if (isNumeric(data[+row][+col])) {
        curr += data[+row][+col]
        if (!foundSymbol && symbolAdjacent(data, +row, +col)) {
          foundSymbol = true
        }
        if (+col === 139) addPartNumber()
      } else if (curr !== '') {
        addPartNumber()
      }
    }
  }
  return partNumbers.reduce((a, c) => a + +c, 0)
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
