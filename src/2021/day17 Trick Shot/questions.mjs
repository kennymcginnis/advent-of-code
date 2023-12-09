// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = true

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const data = rawData.split('\n').map(r => {
  let [command, units] = r.split(' ')
  return { command, units: Number(units) }
})

const parseFile = input => {
  // @example "target area: x=20..30, y=-10..-5"
  let [, x1, x2, y1, y2] = /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/
    .exec(input)
    .map(Number)
  return { min: { x: x1, y: y1 }, max: { x: x2, y: y2 } }
}

const fire = () => {
  const { min, max } = parseFile(rawData)

  const missedTarget = (xv, x, y) => y < min.y || (xv === 0 && (x < min.x || x > max.x))
  const hitTarget = (x, y) => x >= min.x && x <= max.x && y >= min.y && y <= max.y

  function launch(velocity) {
    let x = 0,
      y = 0,
      highest = 0

    while (true) {
      x += velocity.x
      y += velocity.y

      if (y > highest) highest = y

      if (hitTarget(x, y)) return highest
      if (missedTarget(velocity.x, x, y)) return false

      velocity.x += velocity.x === 0 ? 0 : velocity.x < 0 ? 1 : -1
      velocity.y--
    }
  }

  function trajectories() {
    let solutions = []
    for (let x = 0; x <= max.x + 1; x++) {
      for (let y = min.y; y <= 1000; y++) {
        let landed = launch({ x, y })
        if (landed !== false) solutions.push(landed)
      }
    }

    return solutions
  }

  return trajectories()
}

const run = () => {
  timingMonitor()
  let solutions = fire()
  let highest = solutions.sort((a, b) => b - a)[0]
  console.log({ part: 1, answer: highest, time: timingMonitor() })
  console.log({ part: 2, answer: solutions.length, time: '0ms' })
}

run()
