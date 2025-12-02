import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  const splitter = /^(R|L)(\d+)/
  return input.split('\n').map((r, i) => {
    let [_, dir, len] = r.match(splitter)
    return { dir, len: Number(len) % 100, zeros: len.length > 2 ? Number(len[0]) : 0 }
  })
}

const part1 = () => {
  let pos = 50
  let password = 0
  let data = parseInput(input)
  for (let instruction of data) {
    switch (instruction.dir) {
      case 'R': // right (toward higher numbers)
        pos += instruction.len
        pos %= 100
        break
      case 'L': // left (toward lower numbers)
        pos -= instruction.len
        if (pos < 0) pos += 100
        break
    }
    if (pos === 0) password += 1
    // console.dir({ pos, password })
  }
  return password
}

const part2 = () => {
  let pos = 50
  let password = 0
  let data = parseInput(input)
  for (let instruction of data) {
    let originalPos = pos
    password += instruction.zeros
    switch (instruction.dir) {
      case 'R': // right (toward higher numbers)
        pos += instruction.len
        if (pos > 100) password += 1
        pos %= 100
        break
      case 'L': // left (toward lower numbers)
        pos -= instruction.len
        if (pos < 0) {
          pos += 100
          if (originalPos !== 0) password += 1
        }
        break
    }
    if (pos === 0) password += 1
    console.dir({ ...instruction, pos, password })
  }
  return password
}

const run = () => {
  timer = Date.now()
  let answer = part1()
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2() // 5876 < x < 6380 < 6845
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
