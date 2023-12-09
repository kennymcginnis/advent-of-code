import data from './input.mjs'
// import data from './sample1.mjs'

let first = 'AA'

const nonZero = []

const input = data
  .replaceAll('Valve ', '')
  .replaceAll(' has flow rate=', ',')
  .replaceAll('; tunnel leads to valve ', ',')
  .replaceAll('; tunnels lead to valves ', ',')
  .replaceAll(' ', '')
  .split('\n')
  .reduce((agg, curr) => {
    const [valve, flowstr, ...tunnels] = curr.split(',')
    const flow = Number(flowstr)
    if (flow > 0) nonZero.push(valve)
    agg[valve] = { flow, tunnels, neighbors: {} }
    return agg
  }, {})

let connections = Object.keys(input).reduce(
  (a, c) => ((a[c] = input[c].tunnels.reduce((agg, cur) => ((agg[cur] = 1), agg), {})), a),
  {},
)

const shortestDistanceNode = (distances, visited) => {
  let shortest = null
  for (let node in distances) {
    let currentIsShortest = shortest === null || distances[node] < distances[shortest]
    if (currentIsShortest && !visited.includes(node)) shortest = node
  }
  return shortest
}

const findShortestPath = (graph, startNode, endNode) => {
  let distances = {}
  distances[endNode] = 'Infinity'
  distances = Object.assign(distances, graph[startNode])
  let parents = {}
  for (let child in graph[startNode]) {
    parents[child] = startNode
  }

  let visited = []
  let node = shortestDistanceNode(distances, visited)

  while (node) {
    let distance = distances[node]
    let children = graph[node]

    for (let child in children) {
      if (String(child) === String(startNode)) {
        continue
      } else {
        let newdistance = distance + children[child]
        if (!distances[child] || newdistance < distances[child]) {
          distances[child] = newdistance
          parents[child] = node
        }
      }
    }
    visited.push(node)
    node = shortestDistanceNode(distances, visited)
  }

  let shortestPath = [endNode]
  let parent = parents[endNode]
  while (parent) {
    shortestPath.push(parent)
    parent = parents[parent]
  }
  shortestPath.reverse()

  let results = {
    distance: distances[endNode],
    path: shortestPath,
  }
  return results
}

nonZero.forEach(start => {
  let shortedPath = findShortestPath(connections, first, start)
  input[first].neighbors[start] = shortedPath.distance + 1
  nonZero.forEach(end => {
    if (start === end) return
    if (input[start].neighbors[end]) return
    if (input[end].neighbors[start]) {
      input[start].neighbors[end] = input[end].neighbors[start]
      return
    }
    let shortedPath = findShortestPath(connections, start, end)
    input[start].neighbors[end] = shortedPath.distance + 1
  })
})
console.log(input)

// part1 let totalTime = 30
let totalTime = 26
let paths = {}
let highest = { pressure: 0 }

const running = ({ valve, minute, pressure, visited }) => {
  const remaining = {
    neighbors: Object.keys(input[valve].neighbors).filter(n => !visited.includes(n)),
    time: minute + 3 < totalTime,
  }

  if (remaining.neighbors.length > 0 && remaining.time) {
    Object.keys(input[valve].neighbors)
      .filter(n => !visited.includes(n))
      .forEach(neighbor => {
        const timeToArriveAndOpen = minute + input[valve].neighbors[neighbor]
        running({
          valve: neighbor,
          minute: timeToArriveAndOpen,
          pressure: pressure + input[neighbor].flow * (totalTime - timeToArriveAndOpen),
          visited: [...visited, neighbor],
        })
      })
    // part1
    // } else if (pressure > highest.pressure) highest = { pressure, visited }
  }
  if (visited.length > 0) paths[visited.toString()] = { pressure, visited }
}

input[first].tunnels.forEach(neighbor => {
  running({
    valve: first,
    minute: 0,
    pressure: 0,
    visited: [],
  })
})

// console.log(paths)

const uniquePaths = Object.keys(paths).map(path => ({ ...paths[path], path }))
uniquePaths.sort((a, b) => b.pressure - a.pressure)
for (let me = 0; me < uniquePaths.length; me++) {
  if (uniquePaths[me].pressure + uniquePaths?.[me + 1]?.pressure < highest.pressure) break
  for (let elephant = me + 1; elephant < uniquePaths.length; elephant++) {
    if (uniquePaths[me].visited.some(valve => uniquePaths[elephant].visited.includes(valve)))
      continue
    const pressure = uniquePaths[me].pressure + uniquePaths[elephant].pressure
    if (pressure > highest.pressure) {
      highest = { pressure, paths: { me, elephant } }
    }
  }
}

console.log(highest)
