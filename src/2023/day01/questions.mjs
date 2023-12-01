import sample1 from './sample1.mjs'
import sample2 from './sample2.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split('\n').map(r => r.split('').filter(Number))

const part1 = () => {
  let data = parseInput(input)
  return data.reduce((a, c) => Number(c[0] + c[c.length -1]) + a, 0)
}

const part2 = () => {
  let numbers = {
    twone: '21',
    eightwo: '82',
    eighthree: '83',
    sevenine: '79',
    oneight: '18',
    threeight: '38',
    fiveight: '58',
    nineight: '98',
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  }
  let replaced = sample2.replace(/one|two|three|four|five|six|seven|eight|nine/gi, m => m)
  let data = parseInput(replaced)
  return data.reduce((a, c) => Number(c[0] + c[c.length -1]) + a, 0) // 54714 < x < 54780
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({part: 1, answer, time: timingMonitor()})

  timer = Date.now()
  answer = part2()
  console.log({part: 2, answer, time: timingMonitor()})
}

run()
