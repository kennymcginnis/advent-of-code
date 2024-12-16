import sample from './sample.mjs'
import fs from 'fs'
import path from 'path'
let input = fs.readFileSync(path.resolve('./src/2024/day03', './input.txt'), 'utf8')

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  let data = input
    .match(regex)
    .map((op) => op.replace('mul(', '').replace(')', '').split(',').map(Number))
  return data.reduce((acc, [a, b]) => acc + a * b, 0)
}

const regex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g
const part2 = () => {
  let dos = input
    .split(`do()`)
    .map((x) =>
      (x.indexOf(`don't()`) > 0 ? x.substring(0, x.indexOf(`don't()`)) : x)
        .match(regex)
        .map((op) => op.replace('mul(', '').replace(')', '').split(',').map(Number)),
    )
    .flat()
  return dos.reduce((acc, [a, b]) => acc + a * b, 0)
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
