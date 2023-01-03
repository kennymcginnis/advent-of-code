import sample from './sample.mjs'
import input from './input.mjs'

let printing = false

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const notTouching = (a, b) => {
  return (
    Math.max(a.min.x, b.min.x) > Math.min(a.max.x, b.max.x) ||
    Math.max(a.min.y, b.min.y) > Math.min(a.max.y, b.max.y) ||
    Math.max(a.min.z, b.min.z) > Math.min(a.max.z, b.max.z)
  )
}

const parseCoords = input => {
  const [action, coords] = input.split(' ')

  const coord = coords
    .split(',')
    .map(a => a.split('=')[1])
    .map(a => a.split('..').map(Number))

  return {
    // action,
    on: action === 'on',
    min: { x: coord[0][0], y: coord[1][0], z: coord[2][0] },
    max: { x: coord[0][1], y: coord[1][1], z: coord[2][1] },
  }
}

const createCube = ([minX, maxX], [minY, maxY], [minZ, maxZ]) => ({
  min: { x: minX, y: minY, z: minZ },
  max: { x: maxX, y: maxY, z: maxZ },
})

const part1 = () => {
  let rebootSteps = input.split('\n')
  rebootSteps = rebootSteps.slice(0, 20)

  let map = []
  for (let step of rebootSteps) {
    let coords = parseCoords(step)

    for (let x = coords.min.x; x <= coords.max.x; x++) {
      for (let y = coords.min.y; y <= coords.max.y; y++) {
        for (let z = coords.min.z; z <= coords.max.z; z++) {
          map[[x, y, z]] = coords.on
        }
      }
    }
  }

  let totalOn = 0
  for (let val in map) {
    if (map[val]) totalOn++
  }

  return totalOn
}

const part2 = () => {
  function sliceCubes(step, input) {
    let currCube = parseCoords(step)

    let output = []
    if (currCube.on) output.push(currCube)

    for (let existing of input) {
      if (notTouching(existing, currCube)) {
        output.push(existing)
      } else {
        // console.log({ existing, newCube: currCube })
        // Slice left
        if (existing.min.x < currCube.min.x) {
          output.push(
            createCube(
              [existing.min.x, currCube.min.x - 1],
              [existing.min.y, existing.max.y],
              [existing.min.z, existing.max.z],
            ),
          )
          existing.min.x = currCube.min.x
        }

        // Slice Right
        if (existing.max.x > currCube.max.x) {
          output.push(
            createCube(
              [currCube.max.x + 1, existing.max.x],
              [existing.min.y, existing.max.y],
              [existing.min.z, existing.max.z],
            ),
          )
          existing.max.x = currCube.max.x
        }

        // Slice Top
        if (existing.min.y < currCube.min.y) {
          output.push(
            createCube(
              [existing.min.x, existing.max.x],
              [existing.min.y, currCube.min.y - 1],
              [existing.min.z, existing.max.z],
            ),
          )
          existing.min.y = currCube.min.y
        }

        // Slice Bottom
        if (existing.max.y > currCube.max.y) {
          output.push(
            createCube(
              [existing.min.x, existing.max.x],
              [currCube.max.y + 1, existing.max.y],
              [existing.min.z, existing.max.z],
            ),
          )
          existing.max.y = currCube.max.y
        }

        // Slice Front
        if (existing.min.z < currCube.min.z) {
          output.push(
            createCube(
              [existing.min.x, existing.max.x],
              [existing.min.y, existing.max.y],
              [existing.min.z, currCube.min.z - 1],
            ),
          )
          existing.min.z = currCube.min.z
        }

        // Slice Back
        if (existing.max.z > currCube.max.z) {
          output.push(
            createCube(
              [existing.min.x, existing.max.x],
              [existing.min.y, existing.max.y],
              [currCube.max.z + 1, existing.max.z],
            ),
          )
          existing.max.z = currCube.max.z
        }
      }
    }

    return output
  }

  let rebootSteps = input.split('\n')
  let cuboids = rebootSteps.reduce((agg, step) => sliceCubes(step, agg), [])

  let totalOn = 0
  cuboids.forEach(cuboid => {
    const xlen = Math.abs(cuboid.min.x - cuboid.max.x - 1)
    const ylen = Math.abs(cuboid.min.y - cuboid.max.y - 1)
    const zlen = Math.abs(cuboid.min.z - cuboid.max.z - 1)
    totalOn += xlen * ylen * zlen
  })
  return totalOn
}

const run = () => {
  // timer = Date.now()
  // let answer = part1()
  // console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
