import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  let maps = input.split('\n\n').map(r => r.split('\n').map(s => s.split(' ').map(Number)))
  for (let map of maps) {
    map.shift()
    //map.sort((a, b) => a[1] - b[1])
  }

  let seeds = maps.shift()[0]
  seeds = seeds.reduce((prev, curr, index) => {
    if (!(index % 2)) {
      prev.push([curr])
    } else {
      var popped = prev.pop()
      popped.push(curr)
      prev.push(popped)
    }
    return prev
  }, [])

  return { seeds, maps }
}

const part2 = () => {
  let { seeds, maps } = parseInput(input)
  let minValue = Number.MAX_SAFE_INTEGER

  for (var range = 0; range < seeds.length; range++) {
    for (var seed = seeds[range][0]; seed < seeds[range][0] + seeds[range][1]; seed++) {
      let value = seed
      for (var map = 0; map < maps.length; map++) {
        for (var row = 0; row < maps[map].length; row++) {
          if (value >= maps[map][row][1] && value <= maps[map][row][1] + maps[map][row][2]) {
            value = value - maps[map][row][1] + maps[map][row][0]
            break
          }
        }
      }
      if (value < minValue) minValue = value
    }
  }
  return minValue
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
