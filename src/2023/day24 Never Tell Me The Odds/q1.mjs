import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((l) => l.split(' @ ').map((e) => e.split(', ').map(Number)))

const intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  if (denom == 0) return null
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
  }
}

const part1 = () => {
  let data = parseInput(input)
  const IS_EXAMPLE = false

  const MIN = IS_EXAMPLE ? 7 : 200000000000000
  const MAX = IS_EXAMPLE ? 27 : 400000000000000

  let count = 0
  for (let i = 0; i < data.length; i++) {
    const [[p1x, p1y], [v1x, v1y]] = data[i]
    for (let j = i + 1; j < data.length; j++) {
      const [[p2x, p2y], [v2x, v2y]] = data[j]
      const result = intersect(p1x, p1y, p1x + v1x, p1y + v1y, p2x, p2y, p2x + v2x, p2y + v2y)
      if (!result) continue
      const { x, y } = result
      if (!(x >= MIN && x <= MAX && y >= MIN && y <= MAX)) continue
      if (!(x - p1x > 0 === v1x > 0 && y - p1y > 0 === v1y > 0)) continue
      if (!(x - p2x > 0 === v2x > 0 && y - p2y > 0 === v2y > 0)) continue
      count++
    }
  }

  return count
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
