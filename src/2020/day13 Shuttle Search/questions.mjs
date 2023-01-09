import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const part1 = rawInput => {
  let [depart, buses] = rawInput.split('\n')
  depart = Number(depart)
  buses = buses.split(',').filter(Number).map(Number)
  let map = buses.reduce((agg, bus) => {
    agg[bus] = { bus, wait: bus - (depart % bus) }
    return agg
  }, {})
  let next = Object.values(map).sort((a, b) => a.wait - b.wait)[0]
  return next.bus * next.wait
}

const part2 = buses => {
  let [first, ...rest] = buses.split(',').map(Number)
  return rest.reduce(
    ([last, multiplier], current, index) => {
      if (isNaN(current)) return [last, multiplier]
      for (let found = last; ; found += multiplier) {
        if ((found + index + 1) % current === 0) {
          return [found, multiplier * current]
        }
      }
    },
    [first, first],
  )[0]
}

const run = () => {
  timer = Date.now()
  let answer = part1(input)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(input.split('\n')[1])
  console.log({ part: 2, answer, time: timingMonitor() })
}

const test = () => {
  assertEquals(1068781, part2('7,13,x,x,59,x,31,19'))
  assertEquals(3417, part2('17,x,13,19'))
  assertEquals(754018, part2('67,7,59,61'))
  assertEquals(779210, part2('67,x,7,59,61'))
  assertEquals(1261476, part2('67,7,x,59,61'))
  assertEquals(1202161486, part2('1789,37,47,1889'))
}

test()

run()
