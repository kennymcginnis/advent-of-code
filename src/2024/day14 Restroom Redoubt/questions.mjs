import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((line) => line.match(/-?\d+/g).map(Number))
}

// 101 tiles wide and 103 tiles tall
// 11 tiles wide and 7 tiles tall
const seconds = 100,
  // xSize = 7,
  // ySize = 11,
  xSize = 101,
  ySize = 103

const part1 = () => {
  let data = parseInput(input)

  const quadrants = [0, 0, 0, 0],
    xCutoff = (xSize - 1) / 2,
    yCutoff = (ySize - 1) / 2

  data.forEach(([px, py, vx, vy]) => {
    // Convert the direction to a positive integer
    if (vx < 0) vx += xSize
    if (vy < 0) vy += ySize

    // Evaluate the position of the robot after N seconds
    let xFinal = (vx * seconds + px) % xSize
    let yFinal = (vy * seconds + py) % ySize
    // Find the quadrant the robot is in
    // Ignore robots in the cutoffs
    let q = -1
    if (xFinal < xCutoff && yFinal < yCutoff) q = 0
    else if (xFinal > xCutoff && yFinal < yCutoff) q = 1
    else if (xFinal < xCutoff && yFinal > yCutoff) q = 2
    else if (xFinal > xCutoff && yFinal > yCutoff) q = 3
    if (q >= 0) quadrants[q]++
  })
  return quadrants.reduce((a, b) => a * b, 1)
}

const part2 = () => {
  let data = parseInput(input)

  // Part 2
  let seconds = 0
  while (true) {
    let xP2Obj = {}
    let yP2Obj = {}
    data.forEach(([px, py, vx, vy]) => {
      if (vx < 0) vx += xSize
      if (vy < 0) vy += ySize
      let xFinal = (vx * seconds + px) % xSize
      let yFinal = (vy * seconds + py) % ySize
      // Log how many robots are on each row, and on each column
      xP2Obj[xFinal] ||= 0
      xP2Obj[xFinal]++
      yP2Obj[yFinal] ||= 0
      yP2Obj[yFinal]++
    })
    // Assume that when a lot of robots are on the same row, and a lot on the same column, we found the tree
    // It's lazy, I know. Perfect is the enemy of good enough
    const xAlignedRobots = Math.max(...Object.values(xP2Obj))
    const yAlignedRobots = Math.max(...Object.values(yP2Obj))
    // Try with higher numbers if answer is too low
    if (xAlignedRobots > 20 && yAlignedRobots > 20) break
    seconds++
  }

  // Print the tree for good measure
  const line = Array(xSize).fill('.')
  const map = Array.from({ length: ySize }, () => [...line])
  let toPrint = ''

  data.forEach(([px, py, vx, vy]) => {
    if (vx < 0) vx += xSize
    if (vy < 0) vy += ySize
    const xFinal = (vx * seconds + px) % xSize
    const yFinal = (vy * seconds + py) % ySize
    map[yFinal][xFinal] = '*'
  })

  map.forEach((line) => (toPrint += `${line.join('')}\n`))
  console.log(toPrint)

  return seconds
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
