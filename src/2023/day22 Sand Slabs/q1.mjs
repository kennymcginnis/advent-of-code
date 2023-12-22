import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((line) => {
    let [x, y, z, a, b, c] = line.replace('~', ',').split(',').map(Number)
    return { left: { x, y, z }, right: { x: a, y: b, z: c } }
  })

const part1 = (input) => {
  let bricks = parseInput(input)
  bricks.sort((a, b) => a.left.z - b.left.z)

  // ┌---┐
  // | ┌-┼---┐
  // └-┼-┘   |
  //   └-----┘
  const overlaps = (a, b) =>
    Math.max(a.left.x, b.left.x) <= Math.min(a.right.x, b.right.x) &&
    Math.max(a.left.y, b.left.y) <= Math.min(a.right.y, b.right.y)

  for (let index in bricks) {
    let max_z = 1
    for (let i = 0; i < index; i++) {
      const check = bricks[i]
      if (overlaps(bricks[index], check)) {
        max_z = Math.max(max_z, check.right.z + 1)
      }
    }
    bricks[index].right.z -= bricks[index].left.z - max_z
    bricks[index].left.z = max_z
  }

  bricks.sort((a, b) => a.left.z - b.left.z)
  console.log(bricks)

  const k_supports_v = new Array(bricks.length).fill(null).map(() => [])
  const v_supports_k = new Array(bricks.length).fill(null).map(() => [])

  for (let j in  bricks) {
    const upper = bricks[j]
    for (let i = 0; i < j; i++) {
      const lower = bricks[i]
      if (overlaps(lower, upper) && upper.left.z === lower.right.z + 1) {
        k_supports_v[i].push(j)
        v_supports_k[j].push(i)
      }
    }
  }

  return k_supports_v.filter((bricks) => bricks.every((j) => v_supports_k[j].length > 1)).length
}

const run = () => {
  timer = Date.now()
  let answer = part1(input)
  console.log({ part: 1, answer, time: timingMonitor() })
}

run()
