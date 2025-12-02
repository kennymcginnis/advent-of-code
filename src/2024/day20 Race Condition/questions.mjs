import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split(''))
}

const part1 = () => {
  let data = parseInput(sample)
  return
}

const part2 = () => {
  let data = parseInput(sample)
  return
}
const map = $('*').textContent.trim().split('\n')
const rows = map.length
const cols = map[0].length
const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]
let pos = { x: 0, y: 0 }
let counter = 0
outer: for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (map[i][j] === 'S') {
      pos.x = j
      pos.y = i
      break outer
    }
  }
}

let dists = Array.from({ length: rows }, () => Array(cols).fill(-1))
dists[pos.y][pos.x] = 0

while (map[pos.y][pos.x] !== 'E') {
  for (let [x, y] of DIRS) {
    const nx = pos.x + x
    const ny = pos.y + y
    if (ny < 0 || nx < 0 || ny >= rows || nx >= cols) continue
    if (map[ny][nx] === '#') continue
    if (dists[ny][nx] !== -1) continue
    dists[ny][nx] = dists[pos.y][pos.x] + 1
    pos.x = nx
    pos.y = ny
  }
}

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (map[i][j] === '#') continue
    for (let [nx, ny] of [
      [j, i + 2],
      [j + 1, i + 1],
      [j + 2, i],
      [j + 1, i - 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
      if (map[ny][nx] === '#') continue
      if (Math.abs(dists[i][j] - dists[ny][nx]) >= 102) counter++
    }
  }
}

console.log('Part 1 ->', counter)

counter = 0
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (map[i][j] === '#') continue
    for (let r = 2; r < 21; r++) {
      for (let dy = 0; dy < r + 1; dy++) {
        const dx = r - dy
        const dirset = new Set([
          `${i + dy},${j + dx}`,
          `${i + dy},${j - dx}`,
          `${i - dy},${j + dx}`,
          `${i - dy},${j - dx}`,
        ])
        for (const dir of dirset) {
          const [ny, nx] = dir.split(',').map(Number)
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
          if (map[ny][nx] === '#') continue
          if (dists[i][j] - dists[ny][nx] >= 100 + r) counter++
        }
      }
    }
  }
}

console.log('Part 2 ->', counter)

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
