import input from './map.mjs'
import directions from './directions.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let map = [],
  forwards,
  rotations

const parse = () => {
  input.split('\n').map(line => {
    let tmp = Array(50)
    line.split('').forEach((v, col) => {
      if (['.', '#'].includes(v)) tmp[col] = v
    })
    map.push(tmp)
  })

  forwards = directions.match(/\d+/g).map(Number)
  rotations = directions.match(/[RL]/g)
}

const move = { '>': [0, 1], v: [1, 0], '<': [0, -1], '^': [-1, 0] }
const dirValue = { '>': 0, v: 1, '<': 2, '^': 3 }
const rotate = {
  L: { '>': '^', v: '>', '<': 'v', '^': '<' },
  R: { '>': 'v', v: '<', '<': '^', '^': '>' },
}

const mapVal = pos => cube[pos.face][pos.row][pos.col]
const answer = pos =>
  (pos.row + faces[pos.face].row + 1) * 1000 +
  (pos.col + faces[pos.face].col + 1) * 4 +
  dirValue[pos.dir]

const v = 'v'
const faces = [
  {},
  {
    face: 1,
    row: 0,
    col: 50,
    '^': { face: 6, dir: '>' },
    [v]: { face: 3, dir: 'v' },
    '<': { face: 4, dir: '>' },
    '>': { face: 2, dir: '>' },
  },
  {
    face: 2,
    row: 0,
    col: 100,
    '^': { face: 6, dir: '^' },
    [v]: { face: 3, dir: '<' },
    '<': { face: 1, dir: '<' },
    '>': { face: 5, dir: '<' },
  },
  {
    face: 3,
    row: 50,
    col: 50,
    '^': { face: 1, dir: '^' },
    [v]: { face: 5, dir: 'v' },
    '<': { face: 4, dir: 'v' },
    '>': { face: 2, dir: '^' },
  },
  {
    face: 4,
    row: 100,
    col: 0,
    '^': { face: 3, dir: '>' },
    [v]: { face: 6, dir: 'v' },
    '<': { face: 1, dir: '>' },
    '>': { face: 5, dir: '>' },
  },
  {
    face: 5,
    row: 100,
    col: 50,
    '^': { face: 3, dir: '^' },
    [v]: { face: 6, dir: '<' },
    '<': { face: 4, dir: '<' },
    '>': { face: 2, dir: '<' },
  },
  {
    face: 6,
    row: 150,
    col: 0,
    '^': { face: 4, dir: '^' },
    [v]: { face: 2, dir: 'v' },
    '<': { face: 1, dir: 'v' },
    '>': { face: 5, dir: '^' },
  },
]

let cube = [...Array(7)].map(_ => Array.from({ length: 50 }, () => Array(50)))
cube[0] = undefined
const cubed = () => {
  for (let face = 1; face < 7; face++)
    for (let row = 0; row < 50; row++)
      for (let col = 0; col < 50; col++) {
        cube[face][row][col] = map[row + faces[face].row][col + faces[face].col]
      }
}

const nextStep = curr => {
  let [r, c] = move[curr.dir]

  let next = { ...curr }
  next.row += r
  next.col += c

  if (next.row < 0 || next.col < 0 || next.row >= 50 || next.col >= 50) {
    let { row, col, face } = next

    let from = curr.dir
    let to = faces[face][from].dir

    next.dir = to
    next.face = faces[face][from].face

    switch (from + to) {
      case '<<':
        next.col += 50
        break
      case '<>':
        next.row = Math.abs(row + 1 - 50)
        next.col = 0
        break
      case '<v':
        next.col = row
        next.row = 0
        break
      case '><':
        next.row = Math.abs(row + 1 - 50)
        next.col = col - 1
        break
      case '>>':
        next.col = 0
        break
      case '>^':
        next.row = col - 1
        next.col = row
        break
      case '^^':
        next.row += 50
        break
      case '^>':
        next.row = col
        next.col = 0
        break
      case 'v<':
        next.row = col
        next.col = row - 1
        break
      case 'vv':
        next.row = 0
        break
    }
  }
  return next
}

const step = pos => {
  let steps = forwards.shift()
  console.log(`move: ${steps} steps`)
  ;[...Array(steps)].map(_ => {
    let next = nextStep(pos)
    if (mapVal(next) === '#') return pos
    pos = next
  })
  return pos
}

const turn = pos => {
  let rotation = rotations.shift()
  if (!rotation) return pos.dir
  return rotate[rotation][pos.dir]
}

const walk = () => {
  parse()
  cubed()
  let pos = { dir: '>', face: 1, col: 0, row: 0 }
  console.log(`start: ${JSON.stringify(pos)}`)
  while (forwards.length) {
    pos = step(pos)
    console.log(`step: ${JSON.stringify(pos)}`)
    pos.dir = turn(pos)
    console.log(`turn: ${JSON.stringify(pos)}`)
  }
  console.log(answer(pos)) // > 171088
}

walk()
