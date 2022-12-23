// import input from './sample-map.mjs'
// import directions from './sample-directions.mjs'
import input from './map.mjs'
import directions from './directions.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

let map = [],
  cols = 0,
  rows,
  forwards,
  rotations

const parse = () => {
  input.split('\n').map((line, row) => {
    cols = Math.max(cols, line.length)
    let tmp = Array(cols)
    line.split('').forEach((v, col) => {
      if (['.', '#'].includes(v)) tmp[col] = v
    })
    map.push(tmp)
  })
  rows = map.length

  forwards = directions.match(/\d+/g).map(Number)
  rotations = directions.match(/[RL]/g)
}

const move = { '>': [0, 1], v: [1, 0], '<': [0, -1], '^': [-1, 0] }
const dirValue = { '>': 0, v: 1, '<': 2, '^': 3 }
const rotate = {
  L: { '>': '^', v: '>', '<': 'v', '^': '<' },
  R: { '>': 'v', v: '<', '<': '^', '^': '>' },
}

const mapVal = pos => map[pos.row][pos.col]
const answer = pos => (pos.row + 1) * 1000 + (pos.col + 1) * 4 + dirValue[pos.dir]

const nextStep = curr => {
  let [r, c] = move[curr.dir]

  const stepping = next => {
    next.row += r
    next.col += c
    if (next.row >= rows) next.row = 0
    if (next.col >= cols) next.col = 0
    if (next.row < 0) next.row = rows - 1
    if (next.col < 0) next.col = cols - 1
    return next
  }
  curr = stepping(curr)
  while (!mapVal(curr)) curr = stepping(curr)
  return curr
}

const step = pos => {
  let steps = forwards.shift()
  console.log(`move: ${steps} steps`)
  ;[...Array(steps)].map(_ => {
    let next = nextStep({ ...pos })
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
  let pos = { dir: '>', col: map[0].indexOf('.'), row: 0 }
  console.log(`start: ${JSON.stringify(pos)}`)
  while (forwards.length) {
    pos = step(pos)
    console.log(`step: ${JSON.stringify(pos)}`)
    pos.dir = turn(pos)
    console.log(`turn: ${JSON.stringify(pos)}`)
  }
  console.log(answer(pos)) // > 13268
}

walk()
