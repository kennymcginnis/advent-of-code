import { Node, findShortestPath } from '../../utils/dijkstra.mjs'
// import rawData from './sample.mjs'
import rawData from './input.mjs'

let printing = false
let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, 0], // up
  [0, 1], //  right
  [1, 0], //  down
  [0, -1], // left
]

const explode = data => {
  const initialSize = data.length
  for (let row = 0; row < initialSize; row++) {
    const row1 = data[row]
    for (let rY = 0; rY < 5; rY++) {
      const y2 = rY * initialSize + row
      const row2 = data[y2] || (data[y2] = [])
      for (let col = 0; col < initialSize; col++) {
        for (let rX = 0; rX < 5; rX++) {
          if (rY === 0 && rX === 0) continue

          // Compute location to project to
          const x2 = rX * initialSize + col

          // Compute the new risk value
          const increase = rX + rY
          let newRisk = row1[col] + increase
          if (newRisk > 9) newRisk -= 9

          row2[x2] = newRisk
        }
      }
    }
  }
  return data
}

const key = (row, col) => [row, col].toString()

const graphed = input => {
  const graph = new Map()

  for (let row = 0; row < input.length; row++)
    for (let col = 0; col < input.length; col++)
      graph.set(key(row, col), new Node(key(row, col), input[row][col]))

  for (let row = 0; row < input.length; row++)
    for (let col = 0; col < input.length; col++)
      for (let [r, c] of neighbors)
        if (graph.has(key(row + r, col + c)))
          graph.get(key(row, col)).neighbors.push(graph.get(key(row + r, col + c)))

  return graph
}

const part2 = () => {
  const part = 2

  const data = rawData.split('\n').map(r => r.split('').map(Number))
  const input = explode(data)
  const graph = graphed(input)

  const start = graph.get('0,0')
  const end = graph.get([input.length - 1, input.length - 1].toString())

  start.pathDistance = 0
  findShortestPath(start, end)

  if (printing) print(input, graph, end)

  console.log({ part, answer: end.pathDistance, time: timingMonitor() })
}

const print = (grid, graph, end) => {
  const path = new Map()
  //path.add(grid[0][0]);
  for (let current = end; current != null; current = current.prev) {
    path.set(current.key, current)
  }

  const gridText = grid
    .map((row, r) =>
      row
        .map((col, c) => {
          let node = graph.get(key(r, c))
          return path.has(key(r, c))
            ? `\x1b[1;37m${node.distance}\x1b[0m`
            : node.visited
            ? String(node.distance)
            : `\x1b[1;31m${node.distance}\x1b[0m`
        })
        .join(''),
    )
    .join('\n')

  console.log(gridText)
}

const run = () => {
  timer = Date.now()
  console.log({ part: 2 })
  part2()
}

run()
