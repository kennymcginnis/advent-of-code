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

const part2 = () => {
  let data = parseInput(input)
  let partNumbers = {}, curr, foundGearPosition

  function gearPosition(data, row, col) {
    for (const [r, c] of neighbors) {
      if (data?.[row + r]?.[col + c] === '*') return [row + r, col + c]
    }
  }

  function addPartNumber() {
    if (foundGearPosition) {
      if (!partNumbers[foundGearPosition.toString()]) partNumbers[foundGearPosition.toString()] = [curr]
      else partNumbers[foundGearPosition.toString()].push(curr)
    }
    resetTracker()
  }

  function resetTracker() {
    curr = ''
    foundGearPosition = null
  }

  resetTracker()

  for (let row in data) {
    resetTracker()
    for (let col in data[+row]) {
      if (isNumeric(data[+row][+col])) {
        curr += data[+row][+col]
        if (!foundGearPosition) foundGearPosition = gearPosition(data, +row, +col)
        if (+col === 139) addPartNumber()
      } else if (curr !== '') {
        addPartNumber()
      }
    }
  }
  return Object.values(partNumbers).filter(parts => parts.length === 2)
    .reduce((a, c) => a + (c[0] * c[1]), 0)
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
