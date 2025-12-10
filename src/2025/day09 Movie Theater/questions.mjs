import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('\n').map((r) => r.split(',').map(Number))

const area = ([[sx, sy], [bx, by]]) => (Math.abs(sx - bx) + 1) * (Math.abs(sy - by) + 1)

const run = () => {
  timer = Date.now()
  let data = parseInput(sample)

  const pairs = data
    .flatMap((a, i) => data.slice(i + 1).map((b) => [area([a, b]), a, b]))
    .toSorted((a, b) => b[0] - a[0])

  let part1 = pairs[0][0]

  console.log({ part1, time: timingMonitor() })
  timer = Date.now()

  const sides = data.map((p, i) => [p, data[(i + 1) % data.length]])

  const inRange = (a1, a2, b1, b2) =>
    !(a1 <= b1 && a1 <= b2 && a2 <= b1 && a2 <= b2) && !(a1 >= b1 && a1 >= b2 && a2 >= b1 && a2 >= b2)

  const intersectSides = ([[x1, y1], [x2, y2]]) =>
    sides.some(([[sx1, sy1], [sx2, sy2]]) => inRange(sy1, sy2, y1, y2) && inRange(sx1, sx2, x1, x2))

  let part2 = pairs.find((p) => !intersectSides(p.slice(1)))[0]
  console.log({ part2, time: timingMonitor() })
}

run()
