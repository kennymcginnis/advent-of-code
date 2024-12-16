import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.split('')

const neighbors = {
  '^': [-1, 0], // north
  v: [1, 0], //  south
  '<': [0, -1], // west
  '>': [0, 1], //  east
}

const part1 = (data) => {
  let house = [0, 0]
  let houses = { [house]: 1 }
  for (let dir of data) {
    house = [house[0] + neighbors[dir][0], house[1] + neighbors[dir][1]]
    houses[house] = (houses[house] || 0) + 1
  }
  return Object.keys(houses).length
}

const part2 = (data) => {
  let santa = [0, 0]
  let robo = [0, 0]
  let houses = { [santa]: 1 }
  for (let dir = 0; dir < data.length; dir += 2) {
    santa = [santa[0] + neighbors[data[dir]][0], santa[1] + neighbors[data[dir]][1]]
    houses[santa] = (houses[santa] || 0) + 1

    robo = [robo[0] + neighbors[data[dir + 1]][0], robo[1] + neighbors[data[dir + 1]][1]]
    houses[robo] = (houses[robo] || 0) + 1
  }
  return Object.keys(houses).length
}

const run = () => {
  let data = parseInput(input)
  timer = Date.now()
  let answer = part1(data)
  console.log({ part: 1, answer, time: timingMonitor() })

  timer = Date.now()
  answer = part2(data)
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
