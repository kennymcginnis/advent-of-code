import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((line) => line.replace('~', ',').split(',').map(Number))

const part2 = (input) => {
  let bricks = parseInput(input)
  bricks.sort((a, b) => a[2] - b[2])

  // ┌---┐
  // | ┌-┼---┐
  // └-┼-┘   |
  //   └-----┘
  const overlaps = (a, b) =>
    Math.max(a[0], b[0]) <= Math.min(a[3], b[3]) && Math.max(a[1], b[1]) <= Math.min(a[4], b[4])

  for (let index = 0; index < bricks.length; index++) {
    let max_z = 1
    for (let i = 0; i < index; i++) {
      const check = bricks[i]
      if (overlaps(bricks[index], check)) {
        max_z = Math.max(max_z, check[5] + 1)
      }
    }
    bricks[index][5] -= bricks[index][2] - max_z
    bricks[index][2] = max_z
  }

  bricks.sort((a, b) => a[2] - b[2])
  console.log(JSON.stringify(bricks))

  const supports = new Array(bricks.length).fill(null).map(() => [])
  const supportedBy = new Array(bricks.length).fill(null).map(() => [])

  for (let j = 0; j < bricks.length; j++) {
    const upper = bricks[j]
    for (let i = 0; i < j; i++) {
      const lower = bricks[i]
      if (overlaps(lower, upper) && upper[2] === lower[5] + 1) {
        supports[i].push(+j)
        supportedBy[j].push(i)
      }
    }
  }

  let total = 0
  for (let i = 0; i < bricks.length; i++) {
    // queue everything solely supported by current disintegrating block as now falling
    let q = supports[i].filter((j) => supportedBy[j].length === 1)
    let falling = [i, ...q]
    while (q.length > 0) {
      let j = q.shift()
      // look at everything j supports that would fall if j fell
      for (let k of supports[j]) {
        // that are not already falling
        if (!falling.includes(k)) {
          // if all of k's supports are now falling
          if (supportedBy[k].every((v) => falling.includes(v))) {
            q.push(k)
            falling.push(k)
          }
        }
      }
    }
    total += falling.length - 1
  }

  return total - 1 // 2949, 63490, < x < 22246333
}

const run = () => {
  timer = Date.now()
  let answer = part2(input)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
