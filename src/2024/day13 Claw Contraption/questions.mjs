import sample from './sample.mjs'
import input from './input.mjs'
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = () => {
  // Day-specific setup
  let inputs = input.split('\n')
  let answer = 0

  // One input at a time
  for (let i = 0; i < inputs.length; i += 4) {
    // Parse values from input
    const parseButtonAValues = inputs[i].match(/X\+(-?\d+), Y\+(-?\d+)/)
    const AX = parseInt(parseButtonAValues[1], 10)
    const AY = parseInt(parseButtonAValues[2], 10)

    const parseButtonBValues = inputs[i + 1].match(/X\+(-?\d+), Y\+(-?\d+)/)
    const BX = parseInt(parseButtonBValues[1], 10)
    const BY = parseInt(parseButtonBValues[2], 10)

    const parsePrizeValues = inputs[i + 2].match(/X\=(-?\d+), Y\=(-?\d+)/)
    const PX = parseInt(parsePrizeValues[1], 10)
    const PY = parseInt(parsePrizeValues[2], 10)

    // Calculate required button presses
    // Advent of Algebra
    const countA = (PX * BY - BX * PY) / (BY * AX - BX * AY)
    const countB = (PY * AX - AY * PX) / (BY * AX - BX * AY)

    // Only consider valid values (integers between 0 and 100)
    if (
      Number.isInteger(countA) &&
      Number.isInteger(countB) &&
      countA >= 0 &&
      countB >= 0 &&
      countA <= 100 &&
      countB <= 100
    ) {
      answer += countA * 3 + countB
    }
  }
  return answer
}

const part2 = () => {
  // Day-specific setup
  let inputs = input.split('\n')
  let answer = 0

  // One input at a time
  for (let i = 0; i < inputs.length; i += 4) {
    // Parse values from input
    const parseButtonAValues = inputs[i].match(/X\+(-?\d+), Y\+(-?\d+)/)
    const AX = parseInt(parseButtonAValues[1], 10)
    const AY = parseInt(parseButtonAValues[2], 10)

    const parseButtonBValues = inputs[i + 1].match(/X\+(-?\d+), Y\+(-?\d+)/)
    const BX = parseInt(parseButtonBValues[1], 10)
    const BY = parseInt(parseButtonBValues[2], 10)

    const parsePrizeValues = inputs[i + 2].match(/X\=(-?\d+), Y\=(-?\d+)/)
    const PX = parseInt(parsePrizeValues[1], 10)
    const PY = parseInt(parsePrizeValues[2], 10)

    const PXp2 = PX + 10000000000000
    const PYp2 = PY + 10000000000000

    const countAp2 = (PXp2 * BY - BX * PYp2) / (BY * AX - BX * AY)
    const countBp2 = (PYp2 * AX - AY * PXp2) / (BY * AX - BX * AY)

    // Same but remove the <= 100 condition for part 2
    if (Number.isInteger(countAp2) && Number.isInteger(countBp2) && countAp2 >= 0 && countBp2 >= 0) {
      answer += countAp2 * 3 + countBp2
    }
  }
  return answer
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
