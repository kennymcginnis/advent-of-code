/**
 * @typedef {object} Node
 * @property {string} key
 * @property {number} distance
 * @property {number} pathDistance
 * @property {boolean} visited
 * @property {Node[]} neighbors
 * @property {Node | null} prev
 */
function Node(key, distance) {
  this.key = key
  this.distance = distance
  this.pathDistance = Infinity
  this.visited = false
  this.neighbors = []
  this.prev = null
}

function findShortestPath(startNode, endNode) {
  const nodeQueue = new Set()
  nodeQueue.add(startNode)

  function updateConnection(from, to) {
    const newDistance = from.pathDistance + to.distance
    if (newDistance < to.pathDistance) {
      to.pathDistance = newDistance
      to.prev = from
    }
  }

  function pickNextFromQueue() {
    let next = null
    for (const node of nodeQueue) {
      if (next === null || node.pathDistance < next.pathDistance) {
        next = node
      }
    }
    return next
  }

  while (nodeQueue.size > 0) {
    if (endNode.visited) break
    const current = pickNextFromQueue()

    for (let neighbor of current.neighbors) {
      if (!neighbor.visited) {
        updateConnection(current, neighbor)
        nodeQueue.add(neighbor)
      }
    }
    current.visited = true
    nodeQueue.delete(current)
  }
}

export { Node, findShortestPath }
