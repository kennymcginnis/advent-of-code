import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const bytes = input.split('\n').map((line) => line.split(',').map(Number))
  // Build map, set fallen bytes
  const map = Array.from({ length: 71 }, () => Array(71).fill('.'))
  for (let i = 0; i < 1024; i++) {
    map[bytes[i][0]][bytes[i][1]] = '#'
  }
  return { bytes, map }
}

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

function solve(map) {
  let answer
  // BFS
  const queue = []
  const yx = {}
  answer = Infinity
  queue.push({ pos: [0, 0], score: 0 })
  while (queue.length) {
    // Check first queue element
    const {
      pos: [y, x],
      score,
    } = queue.shift()
    yx[`${y},${x}`] ||= Infinity
    // Skip pos where score is too high.
    if (score >= yx[`${y},${x}`] || score >= answer) continue
    // Check if at the end
    if (y === 70 && x === 70) {
      answer = score
      continue
    }
    // Set score for current pos
    yx[`${y},${x}`] = score
    // Evaluate each possible next step
    dirs.forEach(([dy, dx]) => {
      const newY = y + dy
      const newX = x + dx
      // If wall or out of bounds, skip
      if (map[newY]?.[newX] !== '.') return
      // If score for next position is too high, skip
      if (yx[`${newY},${newX}`] <= score + 1) return
      // Enqueue next pos, increment score
      queue.push({ pos: [newY, newX], score: score + 1 })
    })
  }
  return answer
}

const part1 = () => {
  let { map } = parseInput(input)
  return solve(map)
}

const part2 = () => {
  const { bytes, map } = parseInput(input)
  // Drop all bytes
  for (let i = 1024; i < bytes.length; i++) {
    map[bytes[i][0]][bytes[i][1]] = '#'
  }
  let answer
  // Remove one byte at a time, starting from last
  for (let i = bytes.length - 1; i >= 1024; i--) {
    map[bytes[i][0]][bytes[i][1]] = '.'
    answer = solve(map)
    // If a path is found, we're done.
    if (answer !== Infinity) {
      return `${bytes[i]}`
    }
  }
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2() // 10,38
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
