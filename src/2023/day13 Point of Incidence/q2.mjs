import sample from './sample.mjs'
import sample2 from './sample2.mjs'
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
    return [puzzle, invert]
  }
  return input.split('\n\n').map(getPuzzle)
}

const part1 = () => {
  let data = parseInput(input)

  function validateMirror(index, puzzle, smudged) {
    let offset = 1,
      match
    while (index - offset >= 0 && index + offset < puzzle.length - 1) {
      ;[match, smudged] = matching(puzzle[index - offset], puzzle[index + offset + 1], smudged)
      if (!match) return [false, smudged]
      offset++
    }
    return [true, smudged]
  }

  function matching(left, right, smudged = false) {
    if (left === undefined || right === undefined) return [false, false]
    if (smudged) return [left.join('') === right.join(''), true]
    let difference = 0
    for (let i = 0; i < left.length; i++) {
      if (left[i] !== right[i]) difference++
      if (difference > 1) return [false, true]
    }
    return [true, !!difference]
  }

  function print(puzzle) {
    console.log(puzzle.map((x) => x.join('')).join('\n'))
  }

  function identifyMirror([puzzle, invert]) {
    // print(puzzle)
    // print(invert)

    let index = 0,
      match,
      smudged
    while (index < puzzle.length || index < invert.length) {
      ;[match, smudged] = matching(puzzle[index], puzzle[index + 1])
      if (match) {
        ;[match, smudged] = validateMirror(index, puzzle, smudged)
        if (match && smudged) return (index + 1) * 100
      }
      ;[match, smudged] = matching(invert[index], invert[index + 1])
      if (match) {
        ;[match, smudged] = validateMirror(index, invert, smudged)
        if (match && smudged) return index + 1
      }
      index++
    }
    return 0
  }

  return data.map(identifyMirror).reduce((a, c) => a + c) // > 24612
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
