import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => input.split(',').map(Number)

const play = (input, rounds) => {
  const said = Array(rounds)

  for (let i = 0; i < input.length - 1; i++) {
    let num = input[i]
    said[num] = i + 1
  }

  let current_spoken = input[input.length - 1]

  for (let turn = input.length; turn < rounds; turn++) {
    if (!said[current_spoken]) {
      said[current_spoken] = turn
      current_spoken = 0
    } else {
      let last_turn_was_spoken = said[current_spoken]
      said[current_spoken] = turn
      current_spoken = turn - last_turn_was_spoken
    }
  }

  return current_spoken
}

const part1 = data => play(data, 2020)

const part2 = data => play(data, 30000000)

const run = () => {
  timer = Date.now()
  let answer = part1(parseInput(input))
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(parseInput(input))
  console.log({ part: 2, answer, time: timingMonitor() })
}

const test = () => {
  assertEquals(part1([1, 3, 2]), 1)
  assertEquals(part1([2, 1, 3]), 10)
  assertEquals(part1([1, 2, 3]), 27)
  assertEquals(part1([2, 3, 1]), 78)
  assertEquals(part1([3, 2, 1]), 438)
  assertEquals(part1([3, 1, 2]), 1836)

  assertEquals(part2(parseInput(sample)), 175594)
  assertEquals(part2([1, 3, 2]), 2578)
  assertEquals(part2([2, 1, 3]), 3544142)
  assertEquals(part2([1, 2, 3]), 261214)
  assertEquals(part2([2, 3, 1]), 6895259)
  assertEquals(part2([3, 2, 1]), 18)
  assertEquals(part2([3, 1, 2]), 362)
}

test()
run()
