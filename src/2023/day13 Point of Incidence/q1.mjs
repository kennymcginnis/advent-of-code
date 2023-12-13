import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  function getPuzzle(input) {
    let puzzle = input.split('\n').map((row) => row.split(''))

    let invert = Array(puzzle[0].length)
      .fill()
      .map(() => Array(puzzle.length))

    for (let row in puzzle) {
      for (let col in puzzle[row]) {
        invert[col][row] = puzzle[row][col]
      }
    }

    puzzle = puzzle.map((row) => row.join(''))
    invert = invert.map((row) => row.join(''))

    return [puzzle, invert]
  }

  return input.split('\n\n').map(getPuzzle)
}

const part1 = () => {
  let data = parseInput(input)

  function validateMirror(index, puzzle) {
    let offset = 1
    while (index - offset >= 0 && index + offset < puzzle.length - 1) {
      if (puzzle[index - offset] !== puzzle[index + offset + 1]) {
        return false
      }
      offset++
    }
    return true
  }

  function identifyMirror([puzzle, invert]) {
    let index = 0
    while (index < puzzle.length && index < invert.length) {
      if (!!puzzle[index] && !!puzzle[index + 1] && puzzle[index] === puzzle[index + 1]) {
        if (validateMirror(index, puzzle)) {
          return (index + 1) * 100
        }
      }
      if (!!invert[index] && !!invert[index + 1] && invert[index] === invert[index + 1]) {
        if (validateMirror(index, invert)) {
          return index + 1
        }
      }
      index++
    }
  }

  return data.map(identifyMirror).reduce((a, c) => a + c) // < 38194
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
