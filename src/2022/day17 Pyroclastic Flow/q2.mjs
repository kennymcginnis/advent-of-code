import data from './input.mjs'
// import data from './sample1.mjs'

Object.defineProperty(Array.prototype, 'chunk', {
  value: function (size) {
    let res = []
    for (let i = 0; i < this.length; i += size) res.push(this.slice(i, i + size))
    if (res[res.length - 1].length !== size) res.pop()
    return res
  },
})

const input = data.split('')

const newRow = ['|', , , , , , , , '|']
const floor = ['+', '-', '-', '-', '-', '-', '-', '-', '+']
const trillion = 1000000000000
const totalPieces = 5
const initalSet = totalPieces * input.length

let level, levels, pieceNum, windPos, trimmedAt, height, deltas, direction, piece, bottomLeft
const reset = () => {
  level = 0
  levels = [floor]
  pieceNum = 0
  windPos = 0
  trimmedAt = 0
  height = 0
  deltas = []
}

const trim = () => {
  let lowest
  let columns = {}
  for (let r = levels.length - 1; r >= 0; r--) {
    for (let c = 1; c < 8; c++) {
      if (levels[r][c]) columns[c] = r
    }
    if (Object.keys(columns).length === 7) {
      lowest = Object.keys(columns)
        .map(c => columns[c])
        .sort((a, b) => a - b)[0]
      break
    }
  }
  if (lowest > 0) {
    trimmedAt += lowest
    levels = levels.slice(lowest)
  }
}

const highest = () => {
  for (let r = levels.length - 1; r >= 0; r--) {
    for (let c = 1; c < 8; c++) {
      if (levels[r][c]) return r
    }
  }
}

const push = () => {
  direction = input[windPos % input.length]
  windPos++
  // console.log(`pushing piece ${direction}`)

  const incoming = bottomLeft
  switch (piece) {
    case 0:
      // 012345678
      // |..@@@@.|
      if (direction === '>') {
        if (!levels[level][bottomLeft + 4]) bottomLeft += 1
      } else {
        if (!levels[level][bottomLeft - 1]) bottomLeft -= 1
      }
      break
    case 1:
      // 012345678
      // |...@...|
      // |..@@@..|
      // |...@...|
      if (direction === '>') {
        if (
          !levels[level][bottomLeft + 2] &&
          !levels[level + 1][bottomLeft + 3] &&
          !levels[level + 2][bottomLeft + 2]
        )
          bottomLeft += 1
      } else {
        if (
          !levels[level][bottomLeft] &&
          !levels[level + 1][bottomLeft - 1] &&
          !levels[level + 2][bottomLeft]
        )
          bottomLeft -= 1
      }
      break
    case 2:
      // 012345678
      // |....@..|
      // |....@..|
      // |..@@@..|
      if (direction === '>') {
        if (
          !levels[level][bottomLeft + 3] &&
          !levels[level + 1][bottomLeft + 3] &&
          !levels[level + 2][bottomLeft + 3]
        )
          bottomLeft += 1
      } else {
        if (
          !levels[level][bottomLeft - 1] &&
          !levels[level + 1][bottomLeft + 2] &&
          !levels[level + 2][bottomLeft + 2]
        )
          bottomLeft -= 1
      }
      break
    case 3:
      // 012345678
      // |..@....|
      // |..@....|
      // |..@....|
      // |..@....|
      if (direction === '>') {
        if (
          !levels[level][bottomLeft + 1] &&
          !levels[level + 1][bottomLeft + 1] &&
          !levels[level + 2][bottomLeft + 1] &&
          !levels[level + 3][bottomLeft + 1]
        )
          bottomLeft += 1
      } else {
        if (
          !levels[level][bottomLeft - 1] &&
          !levels[level + 1][bottomLeft - 1] &&
          !levels[level + 2][bottomLeft - 1] &&
          !levels[level + 3][bottomLeft - 1]
        )
          bottomLeft -= 1
      }
      break
    case 4:
      // 012345678
      // |..@@...|
      // |..@@...|
      if (direction === '>') {
        if (!levels[level][bottomLeft + 2] && !levels[level + 1][bottomLeft + 2]) bottomLeft += 1
      } else {
        if (!levels[level][bottomLeft - 1] && !levels[level + 1][bottomLeft - 1]) bottomLeft -= 1
      }
      break
    default:
      // |.......|
      // |.......|
      // |.......|
      // +-------+
      break
  }
  return bottomLeft === incoming
}

const fall = () => {
  // console.log('piece falling')
  const incoming = level
  switch (piece) {
    case 0:
      // 012345678
      // |..@@@@.|
      if (
        !levels[level - 1][bottomLeft + 0] &&
        !levels[level - 1][bottomLeft + 1] &&
        !levels[level - 1][bottomLeft + 2] &&
        !levels[level - 1][bottomLeft + 3]
      )
        level--
      break
    case 1:
      // 012345678
      // |...@...|
      // |..@@@..|
      // |...@...|
      if (
        !levels[level][bottomLeft + 0] &&
        !levels[level - 1][bottomLeft + 1] &&
        !levels[level][bottomLeft + 2]
      )
        level--
      break
    case 2:
      // 012345678
      // |....@..|
      // |....@..|
      // |..@@@..|
      if (
        !levels[level - 1][bottomLeft + 0] &&
        !levels[level - 1][bottomLeft + 1] &&
        !levels[level - 1][bottomLeft + 2]
      )
        level--
      break
    case 3:
      // 012345678
      // |..@....|
      // |..@....|
      // |..@....|
      // |..@....|
      if (!levels[level - 1][bottomLeft]) level--
      break
    case 4:
      // 012345678
      // |..@@...|
      // |..@@...|
      if (!levels[level - 1][bottomLeft] && !levels[level - 1][bottomLeft + 1]) level--
      break
    default:
      // |.......|
      // |.......|
      // |.......|
      // +-------+
      break
  }
  return level !== incoming
}

const drop = () => {
  piece = pieceNum % totalPieces
  pieceNum++
  // console.log(`new piece ${piece}`)
  level = highest() + 4
  // console.log(`highest ${top}, level ${level}`)
  if (level + 4 - levels.length > 0) {
    levels.push(...[...Array(level + 4 - levels.length)].map(l => [...newRow]))
  }
  bottomLeft = 3
}

const place = () => {
  // console.log(`place piece ${level}${bottomLeft}`)
  switch (piece) {
    case 0:
      // 012345678
      // |..@@@@.|
      levels[level][bottomLeft + 0] = '#'
      levels[level][bottomLeft + 1] = '#'
      levels[level][bottomLeft + 2] = '#'
      levels[level][bottomLeft + 3] = '#'
      break
    case 1:
      // 012345678
      // |...@...|
      // |..@@@..|
      // |...@...|
      levels[level + 2][bottomLeft + 1] = '#'
      levels[level + 1][bottomLeft + 0] = '#'
      levels[level + 1][bottomLeft + 1] = '#'
      levels[level + 1][bottomLeft + 2] = '#'
      levels[level + 0][bottomLeft + 1] = '#'
      break
    case 2:
      // 012345678
      // |....@..|
      // |....@..|
      // |..@@@..|
      levels[level + 2][bottomLeft + 2] = '#'
      levels[level + 1][bottomLeft + 2] = '#'
      levels[level + 0][bottomLeft + 0] = '#'
      levels[level + 0][bottomLeft + 1] = '#'
      levels[level + 0][bottomLeft + 2] = '#'
      break
    case 3:
      // 012345678
      // |..@....|
      // |..@....|
      // |..@....|
      // |..@....|
      levels[level + 3][bottomLeft] = '#'
      levels[level + 2][bottomLeft] = '#'
      levels[level + 1][bottomLeft] = '#'
      levels[level + 0][bottomLeft] = '#'
      break
    case 4:
      // 012345678
      // |..@@...|
      // |..@@...|
      levels[level + 1][bottomLeft + 0] = '#'
      levels[level + 1][bottomLeft + 1] = '#'
      levels[level + 0][bottomLeft + 0] = '#'
      levels[level + 0][bottomLeft + 1] = '#'
      break
    default:
      // |.......|
      // |.......|
      // |.......|
      // +-------+
      break
  }
}

const print = () => {
  let output = ''
  for (let r = highest() + 1; r >= 0; r--) {
    output += `
${levels[r].map(i => (i === undefined ? '.' : i)).join('')}`
  }
  console.log(output)
}

const record = () => {
  let previous = height
  height = highest() + trimmedAt
  let delta = height - previous
  deltas.push(delta)

  // console.log(height)
}

const nextPiece = () => {
  let falling = true
  drop()
  while (falling) {
    push()
    falling = fall()
  }
  place()
  // print()
  record()
  trim()
}

const play = times => [...Array(times)].map(_ => nextPiece())

const findPattern = () => {
  play(initalSet)

  let searching = true
  let chunk = 1, compare
  while (searching) {
    chunk++
    compare = chunk * 2

    let t = chunk, h = compare
    while (deltas[t++] === deltas[h++]) if (t === compare) searching = false
  }

  let t = chunk, h = compare
  while (deltas[--t] === deltas[--h]) {}

  let start = t + 1
  let end = start + chunk
  let delta = deltas.slice(start, end).reduce((agg, cur) => agg + cur, 0)

  reset()
  return [t, chunk, delta]
}

/*
const findPattern = () => {
  play(initalSet)
  deltas = []
  play(10000) // random number large enough to find a pattern

  for (let size = 2; size < deltas.length; size++) {
    let delta
    let found = deltas.chunk(size).every(c => {
      let current = c.reduce((agg, cur) => agg + cur, 0)
      if (delta) {
        return current === delta
      } else {
        delta = current
        return true
      }
    })
    if (found) {
      reset()
      return [size, delta]
    }
  }
}
*/

const firstQuestion = () => {
  play(2022)
  console.log(height)
  console.log(deltas.reduce((a, v) => a + v, 0))
}

const secondQuestion = () => {
  const [beginning, chunk, delta] = findPattern()

  play(beginning)

  let patterns = Math.floor((trillion - beginning) / chunk)
  let repeatedHeight = patterns * delta
  let remainder = (trillion - beginning) % chunk

  play(remainder)

  console.log(height + repeatedHeight)
}

reset()
// firstQuestion()
secondQuestion()
