import data from './input.mjs'
// import data from './sample1.mjs'

const input = data.split('')

let level = 0,
  pieceNum = 0,
  windPos = 0,
  direction,
  piece,
  bottomLeft

const newRow = ['|', , , , , , , , '|']
let levels = [['+', '-', '-', '-', '-', '-', '-', '-', '+']]

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
  piece = pieceNum % 5
  pieceNum++
  // console.log(`new piece ${piece}`)

  let top = highest()
  level = top + 4
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
  for (let r = levels.length - 1; r >= 0; r--) {
    output += `
${levels[r].map(i => (i === undefined ? '.' : i)).join('')}`
  }
  console.log(output)
}

const move = pieceNum => {
  let falling = true
  drop()
  while (falling) {
    push()
    falling = fall()
  }
  place()
}

;[...Array(2022)].map((_, pos) => move(pos))
// print()
console.log(highest())
