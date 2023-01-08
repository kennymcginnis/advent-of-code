import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  const splitter = /(\d+)-(\d+)\s(\w):\s(\w+)/g
  return input.split('\n').map(r => {
    let [_, min, max, char, pw] = [...r.matchAll(splitter)][0]
    return { min: Number(min), max: Number(max), char, pw, len: pw.length }
  })
}

const part1 = () => {
  let data = parseInput(input)

  return data.filter(({ min, max, char, pw, len }) => {
    let count = len - pw.replaceAll(char, '').length
    return min <= count && count <= max
  }).length
}

const part2 = () => {
  let data = parseInput(input)

  return data.filter(({ min, max, char, pw }) => {
    const first = pw[min - 1]
    const second = pw[max - 1]
    return (first === char || second === char) && !(first === char && second === char)
  }).length // > 422
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
