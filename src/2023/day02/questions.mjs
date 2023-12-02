import sample from './sample.mjs'
import input from './input.mjs'

let printing = true

const assertEquals = (a, b) => console.log(a === b ? '🎉 Yay' : '😭 Oops', a, b)
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = input => {
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  return input.split('\n').map(r => {
    let [_, game] = r.split(': ').map(r =>
      r.split('; ').map(r => {
        let cube = r.split(', ').map(r => {
          let [count, color] = r.split(' ')
          return { [color]: Number(count) }
        })
        return cube.reduce((a, c) => ({ ...a, ...c }), {})
      }))
    return game
  })
}

const part1 = () => {
  let data = parseInput(input)
  // only 12 red cubes, 13 green cubes, and 14 blue cubes
  let max = {
    red: 12,
    green: 13,
    blue: 14
  }
  let answer = 0
  data.forEach((game, g) => {
    let possible = game.every(cube => {
      let { red, green, blue } = cube
      return (red || 0) <= max.red
        && (green || 0) <= max.green
        && (blue || 0) <= max.blue
    })
    if (possible) answer += g + 1
  })
  return answer
}

const part2 = () => {
  let data = parseInput(input)
  let answer = 0
  data.forEach((game, g) => {
    let min = {
      red: 0,
      green: 0,
      blue: 0
    }
    game.forEach(cube => {
      let { red, green, blue } = cube
      if (red > min.red) min.red = red
      if (green > min.green) min.green = green
      if (blue > min.blue) min.blue = blue
    })
    answer += min.red * min.green * min.blue
  })
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
