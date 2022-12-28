// import rawData from './sample.mjs'
import rawData from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const neighbors = [
  [-1, 0], // top
  [0, 1], //  right
  [1, 0], //  bottom
  [0, -1], // left
]

const part1 = () => {
  const part = 1
  const data = rawData.split('\n').map(l => l.split('').map(Number))

  let answer = 0
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      let curr = data[row][col]
      if (
        neighbors.every(([r, c]) =>
          data?.[row + r]?.[col + c] !== undefined ? data[row + r][col + c] > curr : true,
        )
      ) {
        answer += curr + 1
      }
    }
  }

  console.log({ part, answer })
}

const part2 = () => {
  const part = 2
  const data = rawData.split('\n').map(l => l.split('').map(Number))

  let basins = {}
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      let curr = data[row][col]
      if (
        neighbors.every(([r, c]) =>
          data?.[row + r]?.[col + c] !== undefined ? data[row + r][col + c] > curr : true,
        )
      ) {
        basins[[row, col].toString()] = { row, col, curr, visited: {}, count: 0 }
      }
    }
  }

  let spreading = ''
  function spread({ row, col, curr }) {
    neighbors.forEach(([r, c]) => {
      let visiting = [row + r, col + c].toString()
      if (basins[spreading].visited[visiting] !== true) {
        let value = data?.[row + r]?.[col + c]
        let higher = value === 9 ? false : value > curr
        basins[spreading].visited[visiting] = higher
        if (higher) spread({ row: row + r, col: col + c, curr: value })
      }
    })
  }

  for (let key in basins) {
    spreading = key
    let basin = basins[key]
    basin.visited[key] = true
    spread(basin)
    basin.count = Object.values(basin.visited).filter(i => i).length
  }

  let sorted = Object.values(basins)
    .map(b => b.count)
    .sort((a, b) => b - a)

  const [first, second, third] = sorted
  const answer = first * second * third

  console.log({ part, answer })
}

const run = () => {
  timer = Date.now()
  part1()
  console.log(timingMonitor())

  timer = Date.now()
  part2()
  console.log(timingMonitor())
}

run()
