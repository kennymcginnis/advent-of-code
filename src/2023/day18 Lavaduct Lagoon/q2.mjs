import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) =>
  input.split('\n').map((line) => {
    const match = /#([0-9a-f]{5})([0-3])/.exec(line)
    const [, len, dir] = match
    return { dir: ['R', 'D', 'L', 'U'][+dir], len: Number.parseInt('0x' + len) }
  })

const directions = {
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
  U: [-1, 0],
}

const part2 = () => {
  let data = parseInput(input)

  let row = 0
  let col = 0
  const vertices = []
  let perimeter = 0

  for (const { dir, len } of data) {
    let [r, c] = directions[dir]
    row = row + r * len
    col = col + c * len
    vertices.push({ col, row })
    perimeter = perimeter + len
  }

  // Apply the Shoelace Formula to calculate the area
  const calc = vertices.reduce((area, vertex, i, vertices) => {
    const next = vertices[i + 1]
    if (next) {
      return area + vertex.col * next.row - next.col * vertex.row
    }
    return area
  }, 0)
  const area = Math.abs(calc) / 2 + perimeter / 2 + 1

  console.log('Area:', area, 'Perimeter:', perimeter, 'Vertices:', vertices.length)
  return area
}

const run = () => {
  timer = Date.now()
  let answer = part2()
  console.log({ part: 2, answer, time: timingMonitor() })
}

run()
