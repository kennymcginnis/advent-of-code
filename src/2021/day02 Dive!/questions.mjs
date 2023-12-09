// import rawData from './sample1.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const data = rawData.split('\n').map(r => {
  let [command, units] = r.split(' ')
  return { command, units: Number(units) }
})

const part1 = () => {
  let horizontal = 0,
    depth = 0,
    aim = 0,
    part = 1
  for (let { command, units } of data) {
    switch (command) {
      case 'forward':
        horizontal += units
        break
      case 'down':
        depth += units
        break
      case 'up':
        depth -= units
        break
    }
  }
  const answer = horizontal * depth
  console.log({ part, horizontal, depth, answer })
}

const part2 = () => {
  let horizontal = 0,
    depth = 0,
    aim = 0,
    part = 2
  for (let { command, units } of data) {
    switch (command) {
      case 'forward':
        horizontal += units
        depth += aim * units
        break
      case 'down':
        aim += units
        break
      case 'up':
        aim -= units
        break
    }
    // console.log({ horizontal, depth, aim })
  }
  const answer = horizontal * depth
  console.log({ part, horizontal, depth, answer })
}

const run = () => {
  let result1, result2

  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  result2 = part2()
  console.log(timingMonitor())
}

run()
