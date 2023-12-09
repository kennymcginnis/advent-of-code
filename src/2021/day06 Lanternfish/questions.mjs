// import rawData from './sample1.mjs'
import rawData from './input.mjs'
let printing = false

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']

const parseData = () => {
  let lanternfish = {
    zero: 0,
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
    six: 0,
    seven: 0,
    eight: 0,
  }

  rawData.split(',').forEach(fish => {
    let number = numbers[fish]
    lanternfish[number] += 1
  })
  return lanternfish
}

const breed = (lanternfish, duration) => {
  const part = 1
  let days = 0
  while (days < duration) {
    let { zero, one, two, three, four, five, six, seven, eight } = lanternfish
    lanternfish = {
      zero: one,
      one: two,
      two: three,
      three: four,
      four: five,
      five: six,
      six: seven + zero,
      seven: eight,
      eight: zero,
    }
    days++
  }
  return Object.values(lanternfish).reduce((a, c) => a + c, 0)
}

const part1 = () => {
  const part = 1
  let lanternfish = parseData()
  let answer = breed(lanternfish, 80)
  console.log({ part, answer })
}

const part2 = () => {
  const part = 2
  let lanternfish = parseData()
  let answer = breed(lanternfish, 256)
  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
