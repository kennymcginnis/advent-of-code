import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let antennas = {}
  let antinode = {}
  let min = -1
  let max = 50
  input.split('\n').forEach((row, r) => {
    row.split('').forEach((value, c) => {
      if (value !== '.') {
        if (antennas[value]) {
          for (let [r1, c1] of antennas[value]) {
            let rd = r - r1
            let cd = c - c1
            if (r1 - rd > min && r1 - rd < max && c1 - cd > min && c1 - cd < max) {
              antinode[`${r1 - rd},${c1 - cd}`] = true
            }
            if (r + rd > min && r + rd < max && c + cd > min && c + cd < max) {
              antinode[`${r + rd},${c + cd}`] = true
            }
          }
          antennas[value].push([r, c])
        } else antennas[value] = [[r, c]]
      }
    })
  })
  return Object.keys(antinode).length
}

const part2 = () => {
  let antennas = {}
  let antinode = {}
  let min = -1
  // let max = 12
  // sample.split('\n').forEach((row, r) => {
  let max = 50
  input.split('\n').forEach((row, r) => {
    row.split('').forEach((value, c) => {
      if (value !== '.') {
        antinode[`${r},${c}`] = true
        if (antennas[value]) {
          for (let [r1, c1] of antennas[value]) {
            let rd = r - r1
            let cd = c - c1

            // console.log({ last: `${r1},${c1}`, current: `${r},${c}`, diff: `${rd},${cd}` })
            let mul = 1
            while (r1 - rd * mul > min && r1 - rd * mul < max && c1 - cd * mul > min && c1 - cd * mul < max) {
              // console.dir({ antinode: `${r1 - rd * multiplier},${c1 - cd * multiplier}` })
              antinode[`${r1 - rd * mul},${c1 - cd * mul}`] = true
              mul++
            }

            mul = 1
            while (r + rd * mul > min && r + rd * mul < max && c + cd * mul > min && c + cd * mul < max) {
              // console.dir({ antinode: `${r + rd * multiplier},${c + cd * multiplier}` })
              antinode[`${r + rd * mul},${c + cd * mul}`] = true
              mul++
            }
          }
          antennas[value].push([r, c])
        } else antennas[value] = [[r, c]]
      }
    })
  })

  return Object.keys(antinode).length
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
