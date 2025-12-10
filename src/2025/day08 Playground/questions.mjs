import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => {
  return input.split('\n').map((r) => r.split(',').map(Number))
}
const distance3D = (p, q) => Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2)

const run = () => {
  timer = Date.now()

  let data = parseInput(input)
  const distances = {}
  for (let p = 0; p < data.length; p++) {
    for (let q = p + 1; q < data.length; q++) {
      const distance = distance3D(data[p], data[q])
      distances[distance] = [data[p], data[q]]
    }
  }

  console.log({ task: 'calculating distances', time: timingMonitor() })
  timer = Date.now()
  let sortedDistances = Object.keys(distances).sort((a, b) => a - b)
  console.log({ task: 'sorting distances', time: timingMonitor() })

  let visited = {}
  let circuits = {}
  const mergeCircuits = (p, q) => {
    if (visited[p] && visited[q]) {
      const [keep, remove] = [visited[p], visited[q]]
      // console.log(`Merging circuits ${keep} and ${remove}`)
      circuits[keep].push(...circuits[remove])
      for (const point of circuits[remove]) visited[point] = keep
      delete circuits[remove]
    } else if (visited[p] || visited[q]) {
      const existing = visited[p] || visited[q]
      const newPoint = visited[p] ? q : p
      // console.log(`Adding point ${newPoint} to circuit ${existing}`)
      circuits[existing].push(newPoint)
      visited[newPoint] = existing
    } else {
      // console.log(`Creating new circuit ${circuitId} with points ${p} and ${q}`)
      circuits[circuitId] = [p, q]
      visited[p] = visited[q] = circuitId++
    }
  }

  let d = 0
  let circuitId = 1
  timer = Date.now()
  do {
    const [p, q] = distances[sortedDistances[d++]]
    if (visited[p] && visited[p] === visited[q]) continue
    mergeCircuits(p, q)

    if (d === 1000) {
      const part1 = Object.values(circuits)
        .sort((a, b) => b.length - a.length)
        .splice(0, 3)
        .reduce((acc, p) => acc * p.length, 1)
      console.log({ part1, time: timingMonitor() })
      timer = Date.now()
    }
  } while (Object.values(circuits)[0].length !== data.length)

  const [p, q] = distances[sortedDistances[d - 1]]
  const part2 = p[0] * q[0]

  console.log({ part2, time: timingMonitor() })
}

run()
