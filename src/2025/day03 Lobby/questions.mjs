import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split('').map(Number))
}

const part1 = () => {
  let data = parseInput(input)
  let answer = 0
  for (const bank of data) {
    let firstIndex = null
    let first = null
    let second = null

    for (let index = 0; index < bank.length - 1; index++) {
      const battery = bank[index]
      if (battery > first) {
        first = battery
        firstIndex = index
      }
      if (first === 9) break
    }

    for (let index = firstIndex + 1; index < bank.length; index++) {
      const battery = bank[index]
      if (battery > second) second = battery
      if (second === 9) break
    }
    const joltage = first * 10 + second
    // console.log({ answer, joltage })
    answer += joltage
  }
  return answer
}

const part2 = () => {
  let data = parseInput(input)
  let answer = 0
  for (const bank of data) {
    let indexes = new Array(12).fill(-1)
    let digits = new Array(12).fill(-1)
    
    let startIndex = 0
    for (let digit = 0; digit < digits.length; digit++) {
      for (let index = startIndex; index <= bank.length - 12 + digit; index++) {
        const battery = bank[index]
        if (battery > digits[digit]) {
          digits[digit] = battery
          indexes[digit] = index
        }
        if (digits[digit] === 9) break
      }
      startIndex = indexes[digit] + 1
    }

    const joltage = digits.join('')
    // console.log({ answer, joltage })
    answer += Number(joltage)
  }
  return answer
}

const run = () => {
  timer = Date.now()
  let answer = part1() // 17428 < x
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
