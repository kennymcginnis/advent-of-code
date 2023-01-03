import data from './input.mjs'

const grid = data.split('\n').map(l => l.split(''))

let graph = {}

const calcHeight = current => {
  let height = current.charCodeAt()
  if (current === 'S') height = 'a'.charCodeAt()
  if (current === 'E') height = 'z'.charCodeAt()
  return height
}

const addNeighbor = (height, row, col, neighbors) => {
  let neighbor = grid[row][col]
  let neighborHeight = calcHeight(neighbor)

  //Q1: if ((height + 1) < neighborHeight) return
  if (height > neighborHeight + 1) return
  if (neighbor === 'S' || neighbor === 'E') {
    neighbors[neighbor] = 1
  } else {
    neighbors[`${row},${col}`] = 1
  }
}

const init = () => {
  //initializing the grid
  let rows = grid.length
  let cols = grid[0].length

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let current = grid[row][col]
      let height = calcHeight(current)

      let neighbors = {}
      if (row < rows - 1) addNeighbor(height, row + 1, col, neighbors) //right
      if (row > 0) addNeighbor(height, row - 1, col, neighbors) //left
      if (col < cols - 1) addNeighbor(height, row, col + 1, neighbors) //above
      if (col > 0) addNeighbor(height, row, col - 1, neighbors) //below

      //Q2: mock link to "S" with distance of zero
      // if (current === "a") neighbors["S"] = 0

      if (current === 'S' || current === 'E') {
        graph[current] = neighbors
      } else {
        graph[`${row},${col}`] = neighbors
      }
    }
  }
}

const shortestDistanceNode = (distances, visited) => {
  // create a default value for shortest
  let shortest = null

  // for each node in the distances object
  for (let node in distances) {
    // if no node has been assigned to shortest yet
    // or if the current node's distance is smaller than the current shortest
    let currentIsShortest = shortest === null || distances[node] < distances[shortest]

    // and if the current node is in the unvisited set
    if (currentIsShortest && !visited.includes(node)) {
      // update shortest to be the current node
      shortest = node
    }
  }
  return shortest
}

const findShortestPath = (graph, startNode, endNode) => {
  // track distances from the start node using a hash object
  let distances = {}
  distances[endNode] = 'Infinity'
  distances = Object.assign(distances, graph[startNode])
  // track paths using a hash object
  let parents = {}
  for (let child in graph[startNode]) {
    parents[child] = startNode
  }

  // collect visited nodes
  let visited = []
  // find the nearest node
  let node = shortestDistanceNode(distances, visited)

  // for that node:
  while (node) {
    // find its distance from the start node & its child nodes
    let distance = distances[node]
    let children = graph[node]

    // for each of those child nodes:
    for (let child in children) {
      // make sure each child node is not the start node
      if (String(child) === String(startNode)) {
        continue
      } else {
        // save the distance from the start node to the child node
        let newdistance = distance + children[child]
        // if there's no recorded distance from the start node to the child node in the distances object
        // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
        if (!distances[child] || newdistance < distances[child]) {
          // save the distance to the object
          distances[child] = newdistance
          // record the path
          parents[child] = node
        }
      }
    }
    // move the current node to the visited set
    visited.push(node)
    // move to the nearest neighbor node
    node = shortestDistanceNode(distances, visited)
  }

  // using the stored paths from start node to end node
  // record the shortest path
  let shortestPath = [endNode]
  let parent = parents[endNode]
  while (parent) {
    shortestPath.push(parent)
    parent = parents[parent]
  }
  shortestPath.reverse()

  //this is the shortest path
  let results = {
    distance: distances[endNode],
    path: shortestPath,
  }
  // return the shortest path & the end node's distance from the start node
  return results
}

init()
// console.log(graph)
// Q1: S->E
console.log(findShortestPath(graph, 'S', 'E'))

//Q2: E->a(S)
// console.log(findShortestPath(graph, "E", "S"))
