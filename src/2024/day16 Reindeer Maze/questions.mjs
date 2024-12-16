import { Heap } from 'heap-js'
import sample from './sample.mjs'
import input from './input.mjs'

let [timer, timingMonitor] = [0, () => (timer = !timer ? Date.now() : `${Date.now() - timer}ms`)]

const parseInput = (input) => input.replace(/\r\n/g, '\n').split('\n')

const DIRS = {
  N: { y: -1, x: 0 },
  S: { y: 1, x: 0 },
  E: { y: 0, x: 1 },
  W: { y: 0, x: -1 },
}

function dijkstra(map) {
  const { queue, costs, parents, finishNodeIds } = initState(map)

  let queueItem

  while ((queueItem = queue.pop())) {
    updateNeighborsCostsAndParents(queueItem.id)
  }

  const finishCosts = finishNodeIds.map((id) => costs.get(id) ?? Infinity)
  const minFinishCost = Math.min(...finishCosts)
  const allMinimalPaths = finishNodeIds.flatMap((finishNodeId) =>
    costs.get(finishNodeId) === minFinishCost ? getAllPathsFromParents(parents, finishNodeId) : [],
  )
  const uniqueCoordsInMinimalPaths = getUniqueCoords(allMinimalPaths.flatMap((p) => p))

  // display(map, uniqueCoordsInMinimalPaths)

  return {
    minFinishCost,
    minimalPathsCoordsCount: uniqueCoordsInMinimalPaths.size,
  }

  function updateNeighborsCostsAndParents(nodeId) {
    if (!costs.has(nodeId)) costs.set(nodeId, Infinity)

    const cost = costs.get(nodeId)
    const neighbors = getNeighbors(map, nodeId) ?? {}

    neighbors.forEach(({ id: neighborId, cost: neighborEdgeCost }) => {
      const neighborNewCost = cost + neighborEdgeCost
      if (!costs.has(neighborId)) costs.set(neighborId, Infinity)

      if (neighborNewCost < costs.get(neighborId)) {
        queue.push({ id: neighborId, cost: neighborNewCost })
        costs.set(neighborId, neighborNewCost)
        parents.set(neighborId, [nodeId])
      } else if (neighborNewCost === costs.get(neighborId)) {
        const currentParents = parents.get(neighborId) ?? []
        parents.set(neighborId, [...currentParents, nodeId])
      }
    })
  }
}

function initState(map) {
  const queue = new Heap((a, b) => a.cost - b.cost)
  const costs = new Map()
  const parents = new Map()

  let finishNodeIds = []

  for (let y = 0; y < map.length; y++) {
    const row = map[y]
    for (let x = 0; x < row.length; x++) {
      const val = row[x]
      if (val === 'S') {
        const startNodeId = createId({ y, x }, 'E')
        queue.push({ id: startNodeId, cost: 0 })
        costs.set(startNodeId, 0)
      }

      if (val === 'E') {
        finishNodeIds.push(createId({ y, x }, 'E'))
        finishNodeIds.push(createId({ y, x }, 'N'))
        finishNodeIds.forEach((id) => costs.set(id, Infinity))
      }
    }
  }

  return { queue, costs, parents, finishNodeIds }
}

function getNeighbors(map, nodeId) {
  const { y, x, dir: currDir } = splitId(nodeId)
  return Object.entries(DIRS)
    .map(([dir, vector]) => ({
      y: y + vector.y,
      x: x + vector.x,
      dir,
      cost: Infinity,
    }))
    .filter(({ y, x, dir }) => {
      if (map[y]?.[x] == '#') return false
      if (currDir === dir) return true
      if (['N', 'S'].includes(currDir)) return ['W', 'E'].includes(dir)
      if (['W', 'E'].includes(currDir)) return ['N', 'S'].includes(dir)
      return true
    })
    .map(({ y, x, dir }) => ({
      id: createId({ y, x }, dir),
      dir,
      cost: 1 + (dir === currDir ? 0 : 1000),
    }))
}

function getAllPathsFromParents(parents, finishNodeId) {
  function buildPaths(nodeId) {
    if (!parents.has(nodeId)) {
      return [[nodeId]]
    }
    const parentNodes = parents.get(nodeId) ?? []
    const paths = []
    for (const parent of parentNodes) {
      if (!parent) {
        continue
      }
      const parentPaths = buildPaths(parent)
      for (const parentPath of parentPaths) {
        paths.push([...parentPath, nodeId])
      }
    }
    return paths
  }

  return buildPaths(finishNodeId)
}

function getUniqueCoords(nodes) {
  return new Set(
    nodes.map((id) => {
      const { y, x } = splitId(id)
      return `${y},${x}`
    }),
  )
}

function createId({ y, x }, dir) {
  return `${y},${x},${dir}`
}

function splitId(id) {
  const [y, x, dir] = id.split(',')
  return {
    y: Number(y),
    x: Number(x),
    dir,
  }
}

function display(map, set) {
  const str = map
    .map((row, y) =>
      row
        .split('')
        .map((v, x) => {
          if (set.has(`${y},${x}`)) {
            return 'O'
          }
          return v
        })
        .join(''),
    )
    .join('\n')

  console.log(str)
}

const run = () => {
  timer = Date.now()
  const data = parseInput(input)
  const { minFinishCost, minimalPathsCoordsCount } = dijkstra(data)
  const time = timingMonitor()
  console.log({ part: 1, answer: minFinishCost, time })
  console.log({ part: 2, answer: minimalPathsCoordsCount, time })
}

run()
