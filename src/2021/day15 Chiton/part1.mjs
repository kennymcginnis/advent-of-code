// import rawData from './sample.mjs'
import rawData from './input.mjs'
import findShortestPath from '../../utils/dijkstra.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  // [-1, 0], // top
  [0, 1], //  right
  [1, 0], //  bottom
  // [0, -1], // left
]
const graphed = data => {
  const rows = data.length
  const cols = data[0].length

  let output = {
    start: {},
    end: {},
  }

  function connect(position, neighbor, value) {
    if (!output[position]) output[position] = { [neighbor]: value }
    output[position][neighbor] = value
  }

  function key(row, col) {
    if (row === 0 && col === 0) return 'start'
    if (row === rows - 1 && col === cols - 1) return 'end'
    return [row, col].toString()
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      for (let [r, c] of neighbors) {
        if (data?.[row + r]?.[col + c] !== undefined) {
          const position = key(row, col)
          const neighbor = key(row + r, col + c)
          const value = data[row + r][col + c]
          connect(position, neighbor, value)
        }
      }
    }
  }
  return output
}

const part1 = () => {
  const part = 1

  const data = rawData.split('\n').map(r => r.split('').map(Number))
  const graph = graphed(data)

  let answer = findShortestPath(graph, 'start', 'end')
  console.log({ part, answer: answer.distance, time: timingMonitor() })
}


const run = () => {
  timer = Date.now()
  console.log({ part: 1 })
  part1()
}

run()
